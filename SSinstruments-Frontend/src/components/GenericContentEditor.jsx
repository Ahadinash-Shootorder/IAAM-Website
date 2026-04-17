"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

export default function GenericContentEditor({ data, onChange, showImage = true }) {
  const [contentData, setContentData] = useState({
    title: "",
    heading: "",
    description: "",
    content: "",
    image: "",
    buttonLabel: "",
    buttonUrl: "",
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          title: parsed?.title || "",
          heading: parsed?.heading || "",
          description: parsed?.description || "",
          content: parsed?.content || "",
          image: parsed?.image || "",
          buttonLabel: parsed?.buttonLabel || "",
          buttonUrl: parsed?.buttonUrl || "",
        };
        setContentData(validData);
      } catch {
        setContentData({
          title: "",
          heading: "",
          description: "",
          content: "",
          image: "",
          buttonLabel: "",
          buttonUrl: "",
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...contentData, [field]: value };
    setContentData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Content Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          value={contentData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Section Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Heading</label>
        <input
          type="text"
          value={contentData.heading}
          onChange={(e) => handleChange("heading", e.target.value)}
          placeholder="e.g., Main Heading"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={contentData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Brief description"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Content</label>
        <textarea
          value={contentData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="e.g., Detailed content"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {showImage && (
        <div>
          <label className="block text-sm font-semibold mb-2">Image</label>
          <div className="[&_img]:hidden [&_.h-64]:hidden">
            <ImageUpload
              value={contentData.image}
              onChange={(url) => handleChange("image", url)}
              label="Upload Section Image"
            />
          </div>
          {contentData.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={contentData.image}
                alt="Content Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Button Label (Optional)
          </label>
          <input
            type="text"
            value={contentData.buttonLabel}
            onChange={(e) => handleChange("buttonLabel", e.target.value)}
            placeholder="e.g., Learn More"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Button URL</label>
          <input
            type="url"
            value={contentData.buttonUrl}
            onChange={(e) => handleChange("buttonUrl", e.target.value)}
            placeholder="e.g., https://example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
