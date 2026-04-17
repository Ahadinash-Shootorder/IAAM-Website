"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";

export default function OverviewSection({ sections = [], onChange }) {
  const [sections_state, setSections] = useState(sections || []);

  useEffect(() => {
    setSections(sections || []);
  }, [sections]);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      heading: "",
      layout: "image-left",
      image: "",
      text: "",
    };
    const updatedSections = [...sections_state, newSection];
    setSections(updatedSections);
    onChange(updatedSections);
  };

  const removeSection = (id) => {
    const updatedSections = sections_state.filter((s) => s.id !== id);
    setSections(updatedSections);
    onChange(updatedSections);
  };

  const updateSection = (id, field, value) => {
    const updatedSections = sections_state.map((s) =>
      s.id === id ? { ...s, [field]: value } : s,
    );
    setSections(updatedSections);
    onChange(updatedSections);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {sections_state.map((section, index) => (
          <div
            key={section.id}
            className="bg-white border border-gray-300 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold text-gray-700">
                Section {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Remove
              </button>
            </div>

            {/* Heading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading
              </label>
              <input
                type="text"
                value={section.heading}
                onChange={(e) =>
                  updateSection(section.id, "heading", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Section heading"
              />
            </div>

            {/* Layout Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Layout
              </label>
              <div className="flex gap-4">
                <label
                  className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                    section.layout === "image-left"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  title="Image Left, Text Right"
                >
                  <input
                    type="radio"
                    name={`layout-${section.id}`}
                    value="image-left"
                    checked={section.layout === "image-left"}
                    onChange={(e) =>
                      updateSection(section.id, "layout", e.target.value)
                    }
                    className="hidden"
                  />
                  <ImageIcon size={20} className="text-gray-600" />
                  <Type size={20} className="text-gray-600" />
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                    section.layout === "image-right"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  title="Text Left, Image Right"
                >
                  <input
                    type="radio"
                    name={`layout-${section.id}`}
                    value="image-right"
                    checked={section.layout === "image-right"}
                    onChange={(e) =>
                      updateSection(section.id, "layout", e.target.value)
                    }
                    className="hidden"
                  />
                  <Type size={20} className="text-gray-600" />
                  <ImageIcon size={20} className="text-gray-600" />
                </label>
              </div>
            </div>

            {/* Text Editor */}
            <div className="border-t pt-4">
              <RichTextEditor
                label="Section Text"
                value={section.text}
                onChange={(value) => updateSection(section.id, "text", value)}
              />
            </div>

            {/* Image Upload */}
            <div className="border-t pt-4">
              <div className="[&_img]:hidden [&_.h-64]:hidden">
                <ImageUpload
                  key={`image-${section.id}`}
                  label="Section Image"
                  value={section.image}
                  onChange={(value) => updateSection(section.id, "image", value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {sections_state.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No sections added yet</p>
        </div>
      )}

      <button
        type="button"
        onClick={addSection}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium"
      >
        + Add Section
      </button>
    </div>
  );
}
