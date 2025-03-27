"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListRenderer } from "../components/list-renderer";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/components/toast";
import { showConfirmationDialog } from "@/components/popup";

export default function Books() {
  const router = useRouter();

  interface Book {
    _id: string;
    title: string;
    author: string;
    publishedYear: number;
    isbn: string;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "author", label: "Author" },
    { key: "publishedYear", label: "Published Year" },
    { key: "isbn", label: "ISBN" },
  ];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books`,
        {
          params: {
            search: searchQuery || undefined,
            page,
            limit: 10,
            sortBy: "title",
            order: "asc",
          },
        }
      );
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, page]);

  const handleAdd = () => {
    router.push("/book");
  };

  const handleEdit = (book: Book) => {
    console.log("Edit book:", book);
    router.push(`/book/${book._id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmationDialog(
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (!confirmed) return showToast("Deletion cancelled.", "error");

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      showToast("Book deleted successfully!", "success");
    } catch {
      showToast("Failed to delete book. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error)
    return (
      <p className="text-center mt-4 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="flex flex-col justify-start items-center">
      <Toaster position="top-center" />
      <header className="w-full flex justify-center items-center bg-blue-100 h-[62px] text-2xl font-semibold">
        <div className="lg:max-w-[1024px] xl:max-w-[1280px] px-4 w-full">
          Books Manager
        </div>
      </header>
      <main
        className="p-4 w-full lg:max-w-[1024px] xl:max-w-[1280px] overflow-auto"
        style={{ height: "calc(100vh - 62px)" }}
      >
        <ListRenderer
          title=""
          data={books}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
