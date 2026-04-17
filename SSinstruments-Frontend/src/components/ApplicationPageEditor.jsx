"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function ApplicationPageEditor({ data, onChange }) {
  const [pageData, setPageData] = useState({
    banner: {
      heading: "",
      description: "",
      image: "",
      buttonLabel: "",
      buttonUrl: "",
      overlayColor: "rgba(0, 0, 0, 0.3)",
    },
    sections: [],
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          banner: parsed?.banner || {
            heading: "",
            description: "",
            image: "",
            buttonLabel: "",
            buttonUrl: "",
            overlayColor: "rgba(0, 0, 0, 0.3)",
          },
          sections: parsed?.sections || [],
        };
        setPageData(validData);
      } catch {
        setPageData({
          banner: {
            heading: "",
            description: "",
            image: "",
            buttonLabel: "",
            buttonUrl: "",
            overlayColor: "rgba(0, 0, 0, 0.3)",
          },
          sections: [],
        });
      }
    }
  }, [data]);

  const handleBannerChange = (field, value) => {
    const updated = {
      ...pageData,
      banner: { ...pageData.banner, [field]: value },
    };
    setPageData(updated);
    onChange(JSON.stringify(updated));
  };

  const addSection = () => {
    const updated = {
      ...pageData,
      sections: [
        ...pageData.sections,
        { heading: "", content: "" },
      ],
    };
    setPageData(updated);
    onChange(JSON.stringify(updated));
  };

  const updateSection = (index, field, value) => {
    const updated = {
      ...pageData,
      sections: pageData.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    };
    setPageData(updated);
    onChange(JSON.stringify(updated));
  };

  const deleteSection = (index) => {
    const updated = {
      ...pageData,
      sections: pageData.sections.filter((_, i) => i !== index),
    };
    setPageData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Application Page Editor
      </h3>

      {/* Banner Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-300 space-y-4">
        <h4 className="text-base font-semibold text-gray-900">Banner</h4>

        <div>
          <label className="block text-sm font-semibold mb-2">Heading</label>
          <input
            type="text"
            value={pageData.banner.heading}
            onChange={(e) => handleBannerChange("heading", e.target.value)}
            placeholder="e.g., Applications"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={pageData.banner.description}
            onChange={(e) => handleBannerChange("description", e.target.value)}
            placeholder="e.g., Discover our versatile applications"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Banner Image</label>
          <ImageUpload
            value={pageData.banner.image}
            onChange={(url) => handleBannerChange("image", url)}
            label="Upload Banner Image"
          />
          {pageData.banner.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={pageData.banner.image}
                alt="Banner Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Button Label <span className="text-xs text-gray-500">(Optional)</span></label>
            <input
              type="text"
              value={pageData.banner.buttonLabel}
              onChange={(e) => handleBannerChange("buttonLabel", e.target.value)}
              placeholder="e.g., Learn More"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Button URL <span className="text-xs text-gray-500">(Optional)</span></label>
            <input
              type="url"
              value={pageData.banner.buttonUrl}
              onChange={(e) => handleBannerChange("buttonUrl", e.target.value)}
              placeholder="e.g., https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Overlay Color (RGBA) <span className="text-xs text-gray-500">(Optional)</span></label>
          <input
            type="text"
            value={pageData.banner.overlayColor}
            onChange={(e) => handleBannerChange("overlayColor", e.target.value)}
            placeholder="e.g., rgba(0, 0, 0, 0.3)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Overlay for image darkening (RGBA format)
          </p>
        </div>
      </div>

      {/* Repeatable Sections */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900">
            Content Sections (Repeatable)
          </h4>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {pageData.sections && pageData.sections.length > 0 ? (
            pageData.sections.map((section, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-gray-900">Section {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => deleteSection(index)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Heading</label>
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) =>
                      updateSection(index, "heading", e.target.value)
                    }
                    placeholder="e.g., Industrial Applications"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(index, "content", e.target.value)
                    }
                    placeholder="e.g., Describe this application section..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No sections added yet. Click "Add Section" to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
