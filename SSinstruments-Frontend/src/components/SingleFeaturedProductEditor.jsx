"use client";

import { useState, useEffect } from "react";

export default function SingleFeaturedProductEditor({ data, onChange }) {
  const [config, setConfig] = useState({
    productId: "",
    title: "",
    description: "",
    displayStyle: "image-left", // image-left, image-right, full-width
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          productId: parsed?.productId || "",
          title: parsed?.title || "",
          description: parsed?.description || "",
          displayStyle: parsed?.displayStyle || "image-left",
        };
        setConfig(validData);
      } catch {
        setConfig({
          productId: "",
          title: "",
          description: "",
          displayStyle: "image-left",
        });
      }
    }
  }, [data]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Single Featured Product Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Select Product
        </label>
        {loadingProducts ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : (
          <select
            value={config.productId}
            onChange={(e) => handleChange("productId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Choose a product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Section Title</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., New Release"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={config.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Discover our latest innovation"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Display Style
        </label>
        <div className="space-y-2">
          {["image-left", "image-right", "full-width"].map((style) => (
            <label key={style} className="flex items-center gap-2">
              <input
                type="radio"
                name="displayStyle"
                value={style}
                checked={config.displayStyle === style}
                onChange={(e) => handleChange("displayStyle", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm capitalize">
                {style.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
