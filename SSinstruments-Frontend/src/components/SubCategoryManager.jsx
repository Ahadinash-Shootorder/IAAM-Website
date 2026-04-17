"use client";

import { useState, useEffect } from "react";

export default function SubCategoryManager({ categorySlug, categoryName }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    fetchSubcategories();
  }, [categorySlug]);

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(
        `/api/categories/${categorySlug}/subcategories`
      );
      const data = await res.json();
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingId ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Subcategory name is required");
      return;
    }

    const dataToSend = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
    };

    try {
      const url = editingId
        ? `/api/categories/${categorySlug}/subcategories/${editingId}`
        : `/api/categories/${categorySlug}/subcategories`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save subcategory");
      }

      setFormData({ name: "", slug: "", description: "", icon: "" });
      setEditingId(null);
      setShowForm(false);
      fetchSubcategories();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (subcategory) => {
    setFormData(subcategory);
    setEditingId(subcategory.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subcategory?")) return;

    try {
      const res = await fetch(
        `/api/categories/${categorySlug}/subcategories/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      fetchSubcategories();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-gray-600">Loading subcategories...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Subcategories for {categoryName}
        </h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", slug: "", description: "", icon: "" });
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
        >
          {showForm ? "Cancel" : "Add Subcategory"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Subcategory" : "Add New Subcategory"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Microscopes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug {editingId && "(editable)"}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  readOnly={!editingId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (emoji or URL)
              </label>
              <input
                type="text"
                value={formData.icon || ""}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="e.g., 🔬 or /images/icon.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              {editingId ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {subcategories.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
            No subcategories yet
          </div>
        ) : (
          subcategories.map((sub) => (
            <div
              key={sub.id}
              className="bg-gray-50 rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{sub.icon || "📁"}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                    <p className="text-xs text-gray-600">{sub.slug}</p>
                    {sub.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {sub.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sub)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
