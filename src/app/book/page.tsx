"use client";

import React, { useState } from "react";
import axios from "axios";
import { FaBars, FaBook, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/toast";
import { showConfirmationDialog } from "@/components/popup";
import Loader from "@/components/loader";
import { Toaster } from "react-hot-toast";
import InputField from "@/components/input-field";

interface Book {
  title: string;
  author: string;
  description: string;
  publishedYear: string;
  isbn: string;
}

export default function AddBook() {
  const router = useRouter();
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    description: "",
    publishedYear: "",
    isbn: "",
  });
  const [errors, setErrors] = useState<Partial<Book>>({});
  const [loading, setLoading] = useState(false);

  const validateISBN = (isbn: string) => {
    return /^\d{3}-\d{10}$/.test(isbn);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });

    if (name === "isbn" && !validateISBN(value)) {
      setErrors({ ...errors, isbn: "ISBN must be in format XXX-XXXXXXXXXX" });
    } else {
      setErrors({
        ...errors,
        [name]: value.trim() === "" ? "This field is required" : "",
      });
    }
  };

  const handleYearChange = (date: Date | null) => {
    if (date) {
      setBook({ ...book, publishedYear: date.getFullYear().toString() });
      setErrors({ ...errors, publishedYear: "" });
    } else {
      setErrors({ ...errors, publishedYear: "Year is required" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Book> = {};
    Object.keys(book).forEach((key) => {
      if (book[key as keyof Book]?.trim() === "") {
        newErrors[key as keyof Book] = "This field is required";
      }
    });

    if (book.isbn && !validateISBN(book.isbn)) {
      newErrors.isbn = "ISBN must be in format XXX-XXXXXXXXXX";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/book`, book, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      showToast("Book added successfully!", "success");
      setBook({
        title: "",
        author: "",
        description: "",
        publishedYear: "",
        isbn: "",
      });
      router.push("/");
    } catch {
      showToast("Error adding book. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (
      book.title ||
      book.author ||
      book.description ||
      book.publishedYear ||
      book.isbn
    ) {
      const confirmed = await showConfirmationDialog(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        "Yes, leave it!"
      );
      if (!confirmed) return;
    }
    router.back();
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-start items-center">
        <Toaster position="top-center" />
        <header className="w-full flex justify-center bg-blue-100 p-4 text-2xl font-semibold">
          <div className="lg:max-w-[1024px] xl:max-w-[1280px] px-4 w-full">
            Add a New Book
          </div>
        </header>
        <main className="p-4 w-full lg:max-w-[1024px] xl:max-w-[1280px] overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField
              type="text"
              name="title"
              placeholder="Book title"
              value={book.title}
              onChange={handleChange}
              icon={<FaBook />}
              error={errors.title}
            />
            <InputField
              type="text"
              name="isbn"
              placeholder="ISBN"
              value={book.isbn}
              onChange={handleChange}
              icon={<FaBars />}
              error={errors.isbn}
            />
            <DatePicker
              selected={
                book.publishedYear
                  ? new Date(parseInt(book.publishedYear), 0, 1)
                  : null
              }
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className={`block w-full border px-4 py-2 text-base rounded-md ${
                errors.publishedYear ? "border-red-500" : "border-gray-300"
              }`}
              placeholderText="Select Published Year"
            />
            {errors.publishedYear && (
              <p className="text-red-500 text-sm">{errors.publishedYear}</p>
            )}
            <InputField
              type="text"
              name="author"
              placeholder="Author"
              value={book.author}
              onChange={handleChange}
              icon={<FaUser />}
              error={errors.author}
            />
            <InputField
              name="description"
              placeholder="Description"
              value={book.description}
              onChange={handleChange}
              isTextArea
              error={errors.description}
            />

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {loading ? "Adding..." : "Add Book"}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={handleBack}
              >
                Go Back
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
