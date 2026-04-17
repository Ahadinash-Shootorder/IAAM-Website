"use client";

import { useState, useEffect } from "react";

export default function MultipleFeaturedProductEditor({ data, onChange }) {
  const [config, setConfig] = useState({
    title: "",
    description: "",
    selectedProducts: [],
    categoryFilter: "",
    itemsPerRow: 3,
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Ensure the parsed data has the correct structure
        const validData = {
          title: parsed?.title || "",
          description: parsed?.description || "",
          selectedProducts: Array.isArray(parsed?.selectedProducts) ? parsed.selectedProducts : [],
          categoryFilter: parsed?.categoryFilter || "",
          itemsPerRow: parsed?.itemsPerRow || 3,
        };
        setConfig(validData);
      } catch {
        setConfig({
          title: "",
          description: "",
          selectedProducts: [],
          categoryFilter: "",
          itemsPerRow: 3,
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

  const toggleProduct = (productId) => {
    const updated = {
      ...config,
      selectedProducts: config.selectedProducts.includes(productId)
        ? config.selectedProducts.filter((id) => id !== productId)
        : [...config.selectedProducts, productId],
    };
    setConfig(updated);
    onChange(JSON.stringify(updated));
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = config.categoryFilter
    ? products.filter((p) => p.category === config.categoryFilter)
    : products;

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Multiple Featured Products Configuration
      </h3>
      {loadingProducts && <p className="text-sm text-gray-500">Loading categories from products...</p>}
      {!loadingProducts && products.length === 0 && <p className="text-sm text-yellow-600">No products found. Please check your API.</p>}
      {!loadingProducts && products.length > 0 && categories.length === 0 && <p className="text-sm text-yellow-600">Products loaded but no categories found. Check if products have a 'category' field.</p>}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., Featured Products"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Items Per Row
          </label>
          <select
            value={config.itemsPerRow}
            onChange={(e) =>
              handleChange("itemsPerRow", parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={2}>2 Items</option>
            <option value={3}>3 Items</option>
            <option value={4}>4 Items</option>
            <option value={6}>6 Items</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={config.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g., Check out our best-selling products"
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Filter by Category
        </label>
        <select
          value={config.categoryFilter}
          onChange={(e) => handleChange("categoryFilter", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-4">
          Select Products ({config.selectedProducts.length} selected)
        </label>
        {loadingProducts ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.selectedProducts.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No products found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
