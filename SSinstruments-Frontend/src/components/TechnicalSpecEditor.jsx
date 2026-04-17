"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function TechnicalSpecEditor({ value, onChange }) {
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        setSpecs(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSpecs([]);
      }
    }
  }, [value]);

  const addRow = () => {
    const newSpecs = [...specs, { model: "", key: "", value: "" }];
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs));
  };

  const updateCell = (index, field, val) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs));
  };

  const deleteRow = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs));
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Technical Specification
      </label>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">
                Model
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/3">
                Specification
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/3">
                Value
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {specs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No specifications added yet
                </td>
              </tr>
            ) : (
              specs.map((spec, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={spec.model || ""}
                      onChange={(e) =>
                        updateCell(index, "model", e.target.value)
                      }
                      placeholder="e.g., Model A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) =>
                        updateCell(index, "key", e.target.value)
                      }
                      placeholder="e.g., Magnification"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateCell(index, "value", e.target.value)
                      }
                      placeholder="e.g., 40x - 1000x"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(index)}
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <Plus size={20} />
        Add Specification
      </button>
    </div>
  );
}
