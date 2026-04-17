"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, GripVertical } from "lucide-react";

export default function MenuBuilder() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemType, setNewItemType] = useState("category");
  const [newItemTarget, setNewItemTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showDropdownForm, setShowDropdownForm] = useState(null);
  const [dropdownLabel, setDropdownLabel] = useState("");
  const [dropdownType, setDropdownType] = useState("category");
  const [dropdownTarget, setDropdownTarget] = useState("");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchPages();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      setPages([]);
    }
  };
  // This function is to handle dropdown
  const handleAddDropdown = async (parentId) => {
    if (!dropdownLabel || !dropdownTarget) return;

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: dropdownLabel,
          type: dropdownType,
          target: dropdownTarget,
          parentId,
        }),
      });

      if (res.ok) {
        fetchMenuItems();
        setDropdownLabel("");
        setDropdownTarget("");
        setDropdownType("category");
        setShowDropdownForm(null);
      }
    } catch (error) {
      console.error("Error adding dropdown:", error);
    }
  };

  const handleAddMenuItem = async () => {
    if (!newItemLabel || !newItemTarget) return;

    const newItem = {
      label: newItemLabel,
      type: newItemType,
      target: newItemTarget,
    };

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        const item = await res.json();
        setMenuItems([...menuItems, item]);
        setNewItemLabel("");
        setNewItemTarget("");
        setShowAddMenu(false);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });

      if (!res.ok) {
        console.error("Delete failed");
        return;
      }

      // remove from UI (both parent + children)
      const updatedMenu = menuItems
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => child.id !== id) || [],
        }));

      setMenuItems(updatedMenu);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newItems = [...menuItems];
    const draggedItemContent = newItems[draggedItem];

    newItems.splice(draggedItem, 1);
    newItems.splice(targetIndex, 0, draggedItemContent);

    setMenuItems(newItems);
    setDraggedItem(null);

    try {
      await Promise.all(
        newItems.map((item, index) =>
          fetch(`/api/menu/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: index }),
          }),
        ),
      );
    } catch (error) {
      console.error("Error updating menu order:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading menu...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>

      <div className="mb-8">
        {!showAddMenu ? (
          <button
            onClick={() => setShowAddMenu(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Menu Item
          </button>
        ) : (
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Add New Menu Item</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Label</label>
                <input
                  type="text"
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="e.g., Electronics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newItemType}
                  onChange={(e) => {
                    setNewItemType(e.target.value);
                    setNewItemTarget("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="category">Category</option>
                  <option value="page">Page</option>
                  <option value="link">Custom Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {newItemType === "category"
                    ? "Select Category"
                    : newItemType === "page"
                      ? "Select Page"
                      : "URL"}
                </label>

                {newItemType === "category" && (
                  <select
                    value={newItemTarget}
                    onChange={(e) => setNewItemTarget(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}

                {newItemType === "page" && (
                  <select
                    value={newItemTarget}
                    onChange={(e) => setNewItemTarget(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Choose a page...</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                )}

                {newItemType === "link" && (
                  <input
                    type="url"
                    value={newItemTarget}
                    onChange={(e) => setNewItemTarget(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddMenuItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg">
        <h2 className="text-lg font-semibold p-6 border-b bg-gray-50">
          Menu Items
        </h2>

        {menuItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No menu items yet. Add one to get started!
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {menuItems.map((item, index) => (
              <div key={item.id}>
                {/* PARENT MENU ITEM */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-move transition ${
                    draggedItem === index
                      ? "bg-blue-100 shadow-lg opacity-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">Type: {item.type}</p>
                    </div>
                  </div>

                  {/* ADD DROPDOWN BUTTON */}
                  <button
                    onClick={() => setShowDropdownForm(item.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    + Dropdown
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* DROPDOWN FORM */}
                {showDropdownForm === item.id && (
                  <div className="ml-10 mt-3 p-4 border rounded bg-gray-50 space-y-3">
                    {" "}
                    {/* LABEL */}{" "}
                    <input
                      type="text"
                      placeholder="Dropdown Label"
                      value={dropdownLabel}
                      onChange={(e) => setDropdownLabel(e.target.value)}
                      className="border px-3 py-2 rounded w-full"
                    />{" "}
                    {/* TYPE */}{" "}
                    <select
                      value={dropdownType}
                      onChange={(e) => {
                        setDropdownType(e.target.value);
                        setDropdownTarget("");
                      }}
                      className="border px-3 py-2 rounded w-full"
                    >
                      {" "}
                      <option value="category">Category</option>{" "}
                      <option value="page">Page</option>{" "}
                      <option value="link">Custom Link</option>{" "}
                    </select>{" "}
                    {/* TARGET */}{" "}
                    {dropdownType === "category" && (
                      <select
                        value={dropdownTarget}
                        onChange={(e) => setDropdownTarget(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                      >
                        {" "}
                        <option value="">Choose category</option>{" "}
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {" "}
                            {cat.name}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    )}{" "}
                    {dropdownType === "page" && (
                      <select
                        value={dropdownTarget}
                        onChange={(e) => setDropdownTarget(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                      >
                        {" "}
                        <option value="">Choose page</option>{" "}
                        {pages.map((page) => (
                          <option key={page.id} value={page.id}>
                            {" "}
                            {page.title}{" "}
                          </option>
                        ))}{" "}
                      </select>
                    )}{" "}
                    {dropdownType === "link" && (
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={dropdownTarget}
                        onChange={(e) => setDropdownTarget(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                      />
                    )}{" "}
                    <div className="flex gap-2">
                      {" "}
                      <button
                        onClick={() => handleAddDropdown(item.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded"
                      >
                        {" "}
                        Add{" "}
                      </button>{" "}
                      <button
                        onClick={() => setShowDropdownForm(null)}
                        className="px-3 py-2 bg-gray-400 text-white rounded"
                      >
                        {" "}
                        Cancel{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                )}
                {/* CHILD DROPDOWN ITEMS */}
                {item.children?.map((child) => (
                  <div
                    key={child.id}
                    className="ml-10 mt-8 flex items-center justify-between p-3 border border-gray-200 rounded bg-gray-50"
                  >
                    {" "}
                    <div>
                      {" "}
                      <p className="font-medium">{child.label}</p>{" "}
                      <p className="text-xs text-gray-500">
                        Type: {child.type}
                      </p>{" "}
                    </div>{" "}
                    <button
                      onClick={() => handleDeleteMenuItem(child.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      {" "}
                      <Trash2 size={18} />{" "}
                    </button>{" "}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
