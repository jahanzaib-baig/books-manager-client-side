"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FaBars, FaBook, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

export default function UpdateBook() {
  const router = useRouter();
  const { id } = useParams();
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    description: "",
    publishedYear: "",
    isbn: "",
  });
  const [originalBook, setOriginalBook] = useState<Book | null>(null); // Track original state
  const [errors, setErrors] = useState<Partial<Book>>({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track form modifications

  const validateISBN = (isbn: string) => /^\d{3}-\d{10}$/.test(isbn);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/book/${id}`
        );
        setBook(response.data);
        setOriginalBook(response.data); // Store original data
      } catch {
        showToast("Failed to fetch book details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
    setIsDirty(true); // Mark as modified

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
    setIsDirty(true);
  };

  const isBookModified = () => {
    return JSON.stringify(book) !== JSON.stringify(originalBook);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      showToast("Book ID is missing!", "error");
      return;
    }

    if (!isBookModified()) {
      showToast("No changes made", "info");
      return;
    }

    const confirmed = await showConfirmationDialog(
      "Confirm Update",
      "Are you sure you want to update the book?",
      "Yes, update"
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, book, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      showToast("Book updated successfully!", "success");
      router.push("/");
    } catch {
      showToast("Error updating book. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (isDirty && isBookModified()) {
      const confirmed = await showConfirmationDialog(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
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
            Edit Book
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
                {loading ? "Updating..." : "Update Book"}
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
