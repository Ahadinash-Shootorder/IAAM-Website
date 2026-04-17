"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import ApplicationPageEditor from "@/components/ApplicationPageEditor";

export default function ApplicationPageAdmin() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    metaDescription: "",
    content: "",
    sections: "{}",
    slug: "",
  });

  const fetchPage = async () => {
    try {
      const res = await fetch("/api/pages/application");
      if (!res.ok) throw new Error("Page not found");
      const data = await res.json();
      setPage(data);
      setFormData({
        title: data.title,
        metaDescription: data.metaDescription || "",
        content: data.content,
        sections: data.sections || "{}",
        slug: data.slug,
      });
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionsChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      sections: data,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/pages/application", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Page updated successfully!");
      } else {
        alert("Error updating page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!page) return <div className="p-6">Page not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/admin/pages"
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Pages
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">Edit: {page.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="about-us"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL will be: /{formData.slug}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Page Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Meta Description</label>
            <input
              type="text"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="SEO meta description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Main Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Supports HTML and Markdown</p>
          </div>

          <ApplicationPageEditor
            data={formData.sections}
            onChange={handleSectionsChange}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/pages"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
