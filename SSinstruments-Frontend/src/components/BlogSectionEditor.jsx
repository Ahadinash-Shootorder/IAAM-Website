"use client";

import { useState, useEffect } from "react";

export default function BlogSectionEditor({ data, onChange }) {
  const [config, setConfig] = useState({
    title: "",
    description: "",
    postsToShow: 3,
    showViewAllButton: true,
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          title: parsed?.title || "",
          description: parsed?.description || "",
          postsToShow: parsed?.postsToShow || 3,
          showViewAllButton: parsed?.showViewAllButton !== undefined ? parsed.showViewAllButton : true,
        };
        setConfig(validData);
      } catch {
        setConfig({
          title: "",
          description: "",
          postsToShow: 3,
          showViewAllButton: true,
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Blog Section Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">Section Title</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Latest Articles"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={config.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Stay updated with our latest blog posts"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Number of Posts to Show
        </label>
        <select
          value={config.postsToShow}
          onChange={(e) => handleChange("postsToShow", parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={2}>2 Posts</option>
          <option value={3}>3 Posts</option>
          <option value={4}>4 Posts</option>
          <option value={6}>6 Posts</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.showViewAllButton}
            onChange={(e) => handleChange("showViewAllButton", e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-semibold">Show "View All" Button</span>
        </label>
      </div>
    </div>
  );
}
