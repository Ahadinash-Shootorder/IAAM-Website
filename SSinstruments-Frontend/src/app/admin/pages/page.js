"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PAGE_SLUGS = ["homepage", "aboutus", "application", "contactus"];

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const createMissingPages = async () => {
    for (const slug of PAGE_SLUGS) {
      const exists = pages.some((p) => p.slug === slug);
      if (!exists) {
        try {
          await fetch("/api/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              title: slug.replace(/([A-Z])/g, " $1").trim(),
              content: "Start adding content here...",
            }),
          });
        } catch (error) {
          console.error(`Error creating page ${slug}:`, error);
        }
      }
    }
    fetchPages();
  };

  const deletePage = async (slug) => {
    if (confirm(`Delete page: ${slug}?`)) {
      try {
        await fetch(`/api/pages/${slug}`, { method: "DELETE" });
        fetchPages();
      } catch (error) {
        console.error("Error deleting page:", error);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pages Management</h1>
        <button
          onClick={createMissingPages}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Initialize Default Pages
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No pages found. Click &quot;Initialize Default Pages&quot; to create them.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{page.title}</td>
                  <td className="px-6 py-4 text-gray-600">{page.slug}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePage(page.slug)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
