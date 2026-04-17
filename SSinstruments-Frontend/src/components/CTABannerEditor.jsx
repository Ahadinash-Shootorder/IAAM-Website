"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

export default function CTABannerEditor({ data, onChange }) {
  const [bannerData, setBannerData] = useState({
    heading: "",
    description: "",
    buttonLabel: "",
    buttonUrl: "",
    bannerImage: "",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          heading: parsed?.heading || "",
          description: parsed?.description || "",
          buttonLabel: parsed?.buttonLabel || "",
          buttonUrl: parsed?.buttonUrl || "",
          bannerImage: parsed?.bannerImage || "",
          overlayColor: parsed?.overlayColor || "rgba(0, 0, 0, 0.3)",
        };
        setBannerData(validData);
      } catch {
        setBannerData({
          heading: "",
          description: "",
          buttonLabel: "",
          buttonUrl: "",
          bannerImage: "",
          overlayColor: "rgba(0, 0, 0, 0.3)",
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...bannerData, [field]: value };
    setBannerData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        CTA Banner Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">Heading</label>
        <input
          type="text"
          value={bannerData.heading}
          onChange={(e) => handleChange("heading", e.target.value)}
          placeholder="e.g., Limited Time Offer"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={bannerData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Get 50% off on selected products"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Button Label
          </label>
          <input
            type="text"
            value={bannerData.buttonLabel}
            onChange={(e) => handleChange("buttonLabel", e.target.value)}
            placeholder="e.g., Shop Now"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Button URL</label>
          <input
            type="url"
            value={bannerData.buttonUrl}
            onChange={(e) => handleChange("buttonUrl", e.target.value)}
            placeholder="e.g., https://example.com/sale"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Banner Image</label>
        <div className="[&_img]:hidden [&_.h-64]:hidden">
          <ImageUpload
            value={bannerData.bannerImage}
            onChange={(url) => handleChange("bannerImage", url)}
            label="Upload Banner Image"
          />
        </div>
        {bannerData.bannerImage && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img
              src={bannerData.bannerImage}
              alt="CTA Banner Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Overlay Color (RGBA)
        </label>
        <input
          type="text"
          value={bannerData.overlayColor}
          onChange={(e) => handleChange("overlayColor", e.target.value)}
          placeholder="e.g., rgba(0, 0, 0, 0.3)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Overlay for image darkening (RGBA format)
        </p>
      </div>
    </div>
  );
}
