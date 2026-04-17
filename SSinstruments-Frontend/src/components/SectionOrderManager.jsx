"use client";

import { useState } from "react";
import { GripVertical, Save } from "lucide-react";

export default function SectionOrderManager({ sections, onSave }) {
  const [items, setItems] = useState(sections.sort((a, b) => a.order - b.order));
  const [draggedItem, setDraggedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newItems = [...items];
    const draggedItemContent = newItems[draggedItem];

    newItems.splice(draggedItem, 1);
    newItems.splice(targetIndex, 0, draggedItemContent);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await Promise.all(
        items.map((item, index) =>
          fetch(`/api/home-sections/${item.sectionKey}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...item, 
              order: index,
              title: item.title,
              description: item.description,
            }),
          })
        )
      );
      onSave();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Section Order</h2>
        <button
          onClick={handleSaveOrder}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Order"}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((section, index) => (
          <div
            key={section.id}
            draggable={editingId !== section.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`border border-gray-200 rounded-lg p-4 transition ${
              draggedItem === index
                ? "bg-blue-100 shadow-lg opacity-50 cursor-move"
                : editingId === section.id ? "bg-blue-50" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <GripVertical size={20} className="text-gray-400 flex-shrink-0 mt-2" />

              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleUpdateItem(section.id, "title", e.target.value)}
                    onClick={() => setEditingId(section.id)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={section.description || ""}
                    onChange={(e) => handleUpdateItem(section.id, "description", e.target.value)}
                    onClick={() => setEditingId(section.id)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex-shrink-0 px-3 py-2 bg-gray-100 rounded-lg h-fit">
                <span className="text-sm font-bold text-gray-700">
                  #{index + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Drag sections to reorder. Click "Save Order" to apply changes.
      </p>
    </div>
  );
}
