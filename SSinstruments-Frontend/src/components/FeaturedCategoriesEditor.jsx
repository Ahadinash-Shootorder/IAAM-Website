"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function FeaturedCategoriesEditor({ data, onChange }) {
  const [categoriesData, setCategoriesData] = useState({
    title: "",
    description: "",
    categories: [],
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          title: parsed?.title || "",
          description: parsed?.description || "",
          categories: Array.isArray(parsed?.categories) ? parsed.categories : [],
        };
        setCategoriesData(validData);
      } catch {
        setCategoriesData({
          title: "",
          description: "",
          categories: [],
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...categoriesData, [field]: value };
    setCategoriesData(updated);
    onChange(JSON.stringify(updated));
  };

  const addCategory = () => {
    const updated = {
      ...categoriesData,
      categories: [
        ...categoriesData.categories,
        { name: "", description: "", image: "", link: "" },
      ],
    };
    setCategoriesData(updated);
    onChange(JSON.stringify(updated));
  };

  const updateCategory = (index, field, value) => {
    const updated = {
      ...categoriesData,
      categories: categoriesData.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      ),
    };
    setCategoriesData(updated);
    onChange(JSON.stringify(updated));
  };

  const deleteCategory = (index) => {
    const updated = {
      ...categoriesData,
      categories: categoriesData.categories.filter((_, i) => i !== index),
    };
    setCategoriesData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Featured Categories Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">Section Title</label>
        <input
          type="text"
          value={categoriesData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Our Product Categories"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={categoriesData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Browse our wide range of products"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900">
            Categories (Repeatable)
          </h4>
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        <div className="space-y-4">
          {categoriesData.categories && categoriesData.categories.length > 0 ? (
            categoriesData.categories.map((category, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-gray-900">
                    Category {index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => deleteCategory(index)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(index, "name", e.target.value)
                      }
                      placeholder="e.g., Microscopes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Link
                    </label>
                    <input
                      type="text"
                      value={category.link}
                      onChange={(e) =>
                        updateCategory(index, "link", e.target.value)
                      }
                      placeholder="e.g., /products/microscopes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={category.description}
                    onChange={(e) =>
                      updateCategory(index, "description", e.target.value)
                    }
                    placeholder="e.g., High-quality microscopes for research"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Image
                  </label>
                  <div className="[&_img]:hidden [&_.h-64]:hidden">
                    <ImageUpload
                      value={category.image}
                      onChange={(url) =>
                        updateCategory(index, "image", url)
                      }
                      label="Upload Category Image"
                    />
                  </div>
                  {category.image && (
                    <div className="mt-2">
                      <img
                        src={category.image}
                        alt="Category"
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No categories added yet. Click "Add Category" to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
