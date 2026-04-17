"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function ApplicationAreaEditor({ data, onChange }) {
  const [areaData, setAreaData] = useState({
    title: "",
    description: "",
    areas: [],
  });

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          title: parsed?.title || "",
          description: parsed?.description || "",
          areas: Array.isArray(parsed?.areas) ? parsed.areas : [],
        };
        setAreaData(validData);
      } catch {
        setAreaData({
          title: "",
          description: "",
          areas: [],
        });
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...areaData, [field]: value };
    setAreaData(updated);
    onChange(JSON.stringify(updated));
  };

  const addArea = () => {
    const updated = {
      ...areaData,
      areas: [
        ...areaData.areas,
        { name: "", description: "", image: "", link: "" },
      ],
    };
    setAreaData(updated);
    onChange(JSON.stringify(updated));
  };

  const updateArea = (index, field, value) => {
    const updated = {
      ...areaData,
      areas: areaData.areas.map((area, i) =>
        i === index ? { ...area, [field]: value } : area
      ),
    };
    setAreaData(updated);
    onChange(JSON.stringify(updated));
  };

  const deleteArea = (index) => {
    const updated = {
      ...areaData,
      areas: areaData.areas.filter((_, i) => i !== index),
    };
    setAreaData(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Application Area Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">Section Title</label>
        <input
          type="text"
          value={areaData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Application Areas"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={areaData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Explore where our products are used"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900">
            Application Areas (Repeatable)
          </h4>
          <button
            type="button"
            onClick={addArea}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Area
          </button>
        </div>

        <div className="space-y-4">
          {areaData.areas && areaData.areas.length > 0 ? (
            areaData.areas.map((area, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-gray-900">
                    Area {index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => deleteArea(index)}
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
                      value={area.name}
                      onChange={(e) =>
                        updateArea(index, "name", e.target.value)
                      }
                      placeholder="e.g., Education"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Link
                    </label>
                    <input
                      type="text"
                      value={area.link}
                      onChange={(e) =>
                        updateArea(index, "link", e.target.value)
                      }
                      placeholder="e.g., /applications/education"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={area.description}
                    onChange={(e) =>
                      updateArea(index, "description", e.target.value)
                    }
                    placeholder="e.g., Used in schools and universities"
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
                      value={area.image}
                      onChange={(url) => updateArea(index, "image", url)}
                      label="Upload Area Image"
                    />
                  </div>
                  {area.image && (
                    <div className="mt-2">
                      <img
                        src={area.image}
                        alt="Area"
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No areas added yet. Click "Add Area" to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
