"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageUpload({
  label,
  value,
  onChange,
  multiple = false,
}) {
  const [preview, setPreview] = useState(multiple ? value || [] : value || "");
  const [isDragging, setIsDragging] = useState(false);
  const uniqueId = Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    setPreview(multiple ? value || [] : value || "");
  }, [value, multiple]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (multiple) {
          setPreview((prev) => {
            const newPreview = [...prev, result];
            onChange(newPreview);
            return newPreview;
          });
        } else {
          setPreview(result);
          onChange(result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeImage = (index) => {
    if (multiple) {
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
      onChange(newPreview);
    } else {
      setPreview("");
      onChange("");
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {multiple ? (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`gallery-upload-${uniqueId}`}
            />
            <label htmlFor={`gallery-upload-${uniqueId}`} className="cursor-pointer">
              <div className="text-gray-600">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8l-4 4m0 0l4 4m-4-4h16M9 20h30"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm">
                  Drag and drop images or click to select
                </p>
              </div>
            </label>
          </div>

          {preview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {preview.map((img, idx) => (
                <div key={idx} className="relative group">
                  <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`feature-upload-${uniqueId}`}
            />
            <label htmlFor={`feature-upload-${uniqueId}`} className="cursor-pointer">
              <div className="text-gray-600">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8l-4 4m0 0l4 4m-4-4h16M9 20h30"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm">
                  Drag and drop an image or click to select
                </p>
              </div>
            </label>
          </div>

          {preview && (
            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden group">
              <Image
                src={preview}
                alt="Feature image preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(0)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xl"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
