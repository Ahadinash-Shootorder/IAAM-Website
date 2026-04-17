"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import OverviewSection from "@/components/OverviewSection";
import TechnicalSpecEditor from "@/components/TechnicalSpecEditor";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategoryId: "",
    description: "",
    price: "",
    sku: "",
    stock: "",
    overview: "",
    overviewImage: "",
    overviewSections: [],
    technicalSpecification: "",
    application: "",
    featureImage: "",
    galleryImages: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("Submitting formData:", formData);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("Product created successfully!");
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create product");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError("An error occurred while saving the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Add New Product</h1>
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Products
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description Section */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product description"
                />
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>

              <RichTextEditor
                label="Overview Text"
                value={formData.overview}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, overview: value }))
                }
              />
            </div>

            {/* Content Sections (Key Benefits) */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Key Benefits & Sections
              </h2>

              <OverviewSection
                sections={formData.overviewSections}
                onChange={(sections) =>
                  setFormData((prev) => ({
                    ...prev,
                    overviewSections: sections,
                  }))
                }
              />

              <TechnicalSpecEditor
                label="Technical Specification"
                value={formData.technicalSpecification}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    technicalSpecification: value,
                  }))
                }
              />

              <RichTextEditor
                label="Application"
                value={formData.application}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, application: value }))
                }
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Details Section */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                Product Details
              </h2>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subcategory (optional)</option>
                  {formData.category &&
                    categories
                      .find((cat) => cat.name === formData.category)
                      ?.subcategories?.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Stock quantity"
                />
              </div>
            </div>

            {/* Feature Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <ImageUpload
                label="Feature Image"
                value={formData.featureImage}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, featureImage: value }))
                }
              />
            </div>

            {/* Overview Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <ImageUpload
                label="Overview Image"
                value={formData.overviewImage}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, overviewImage: value }))
                }
              />
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <ImageUpload
                label="Gallery Images"
                value={formData.galleryImages}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, galleryImages: value }))
                }
                multiple={true}
              />
            </div>
          </div>
        </form>

        {/* Sticky Submit Buttons */}
        <div className="fixed bottom-0 right-0 bg-white border-l border-gray-200 shadow-lg p-4 z-50">
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition text-sm"
            >
              {loading ? "Saving..." : "Create"}
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition text-sm text-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Spacing to prevent content from hiding under sticky buttons */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
