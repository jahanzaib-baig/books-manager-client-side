"use client";

import {
  FaEdit,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface ListRendererProps<T> {
  title: string;
  data: T[];
  columns: Column[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const ListRenderer = <T extends { _id: string }>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  searchQuery,
  setSearchQuery,
  page,
  totalPages,
  onPageChange,
}: ListRendererProps<T>) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setSearchQuery(localSearch.trim()); // Update only after 500ms of inactivity
    }, 2000);

    return () => clearTimeout(delaySearch); // Cleanup timeout on every change
  }, [localSearch]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
        <div className="w-full flex flex-row justify-between sm:justify-start items-center gap-4">
          {title && (
            <div className="text-gray-700 font-semibold text-4xl">{title}</div>
          )}
          <button
            onClick={() => onAdd()}
            className="text-gray-500 p-2 bg-gray-200 rounded-full hover:text-gray-700 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
        <div className="w-full sm:w-[400px] border border-gray-300 rounded-md flex gap-[4px] p-1 flex-row justify-items-start items-center">
          <div className="p-2 bg-gray-200 rounded-full">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by title"
            className="w-full focus:outline-none"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)} // Updates state and triggers fetch
          />
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto shadow-md border border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b first:rounded-t-lg">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-left capitalize font-semibold"
                >
                  {col.label}
                </th>
              ))}
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-200 border-b border-gray-300 last:border-0"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-3">
                      {String(item[col.key as keyof T])}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <button
                        className="text-blue-500 p-2 bg-blue-200 rounded-full hover:text-blue-700 cursor-pointer"
                        onClick={() => onEdit(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 p-2 bg-red-200 rounded-full hover:text-red-700 cursor-pointer"
                        onClick={() => onDelete(String(item["_id"]))}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-3 text-center font-semibold text-gray-500"
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <FaExclamationTriangle />
                  No Records Found
                </div>
              </td>
            </tr>
          )}
        </table>
      </div>

      <div
        style={{ height: "calc(100vh - 240px)" }}
        className="w-full md:hidden flex flex-col gap-4 overflow-auto"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md bg-white flex flex-col transition transform hover:scale-105 duration-200"
          >
            {columns.map((col) => (
              <p key={col.key} className="text-sm text-gray-700">
                <strong className="capitalize font-medium">
                  {col.label}:{" "}
                </strong>
                {String(item[col.key as keyof T])}
              </p>
            ))}
            <div className="flex mt-2 space-x-2">
              <button className="text-blue-500" onClick={() => onEdit(item)}>
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => onDelete(String(item["_id"]))}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
