"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function HeroBannerEditor({ data, onChange }) {
  const [bannerData, setBannerData] = useState({
    title: "",
    description: "",
    autoplay: true,
    autoplayDuration: 5,
    showDots: true,
    showArrows: true,
    overlayColor: "rgba(0, 0, 0, 0.2)",
    slides: [],
  });
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Merge with defaults to ensure all fields exist
        const validData = {
          title: parsed?.title || "",
          description: parsed?.description || "",
          autoplay: parsed?.autoplay !== undefined ? parsed.autoplay : true,
          autoplayDuration: parsed?.autoplayDuration || 5,
          showDots: parsed?.showDots !== undefined ? parsed.showDots : true,
          showArrows: parsed?.showArrows !== undefined ? parsed.showArrows : true,
          overlayColor: parsed?.overlayColor || "rgba(0, 0, 0, 0.2)",
          slides: Array.isArray(parsed?.slides) ? parsed.slides : [],
        };
        setBannerData(validData);
      } catch {
        setBannerData({
          title: "",
          description: "",
          autoplay: true,
          autoplayDuration: 5,
          showDots: true,
          showArrows: true,
          overlayColor: "rgba(0, 0, 0, 0.2)",
          slides: [],
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...bannerData, [field]: value };
    setBannerData(updated);
    onChange(JSON.stringify(updated));
  };

  // Slides management
  const addSlide = () => {
    const updated = {
      ...bannerData,
      slides: [
        ...bannerData.slides,
        {
          heading: "",
          subheading: "",
          buttonLabel: "",
          buttonUrl: "",
          bannerImage: "",
        },
      ],
    };
    setBannerData(updated);
    onChange(JSON.stringify(updated));
  };

  const updateSlide = (index, field, value) => {
    const updated = {
      ...bannerData,
      slides: bannerData.slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide
      ),
    };
    setBannerData(updated);
    onChange(JSON.stringify(updated));
  };

  const deleteSlide = (index) => {
    const updated = {
      ...bannerData,
      slides: bannerData.slides.filter((_, i) => i !== index),
    };
    setBannerData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Hero Banner Slider Configuration
      </h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Slider Settings
        </button>
        <button
          onClick={() => setActiveTab("slides")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "slides"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Banner Slides
        </button>
      </div>

      {/* Slider Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={bannerData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Hero Banner"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Autoplay Duration (seconds)
              </label>
              <input
                type="number"
                value={bannerData.autoplayDuration}
                onChange={(e) =>
                  handleChange("autoplayDuration", parseInt(e.target.value))
                }
                placeholder="5"
                min="1"
                max="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={bannerData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Hero banner with multiple slides"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bannerData.autoplay}
                onChange={(e) => handleChange("autoplay", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold">Autoplay</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bannerData.showDots}
                onChange={(e) => handleChange("showDots", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold">Show Dots</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bannerData.showArrows}
                onChange={(e) => handleChange("showArrows", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold">Show Arrows</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Overlay Color (RGBA)
            </label>
            <input
              type="text"
              value={bannerData.overlayColor}
              onChange={(e) => handleChange("overlayColor", e.target.value)}
              placeholder="e.g., rgba(0, 0, 0, 0.2)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Overlay for image darkening (RGBA format)
            </p>
          </div>
        </div>
      )}

      {/* Banner Slides Tab */}
      {activeTab === "slides" && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={addSlide}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {bannerData.slides && bannerData.slides.length > 0 ? (
              bannerData.slides.map((slide, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg bg-white space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-gray-900">Slide {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => deleteSlide(index)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={slide.heading}
                      onChange={(e) =>
                        updateSlide(index, "heading", e.target.value)
                      }
                      placeholder="e.g., Welcome to Our Store"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Subheading
                    </label>
                    <textarea
                      value={slide.subheading}
                      onChange={(e) =>
                        updateSlide(index, "subheading", e.target.value)
                      }
                      placeholder="e.g., Discover our amazing products"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={slide.buttonLabel}
                        onChange={(e) =>
                          updateSlide(index, "buttonLabel", e.target.value)
                        }
                        placeholder="e.g., Shop Now"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Button URL
                      </label>
                      <input
                        type="url"
                        value={slide.buttonUrl}
                        onChange={(e) =>
                          updateSlide(index, "buttonUrl", e.target.value)
                        }
                        placeholder="e.g., https://example.com/shop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Slide Image
                    </label>
                    <div className="[&_img]:hidden [&_.h-64]:hidden">
                      <ImageUpload
                        value={slide.bannerImage}
                        onChange={(url) =>
                          updateSlide(index, "bannerImage", url)
                        }
                        label="Upload Slide Image"
                      />
                    </div>
                    {slide.bannerImage && (
                      <div className="mt-2">
                        <img
                          src={slide.bannerImage}
                          alt="Slide"
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No slides added yet. Click "Add Slide" to get started.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
