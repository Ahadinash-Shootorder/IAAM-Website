"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryLayout({ initialSlug }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Fetch products when slug or subcategory changes
  useEffect(() => {
    if (!activeSlug) return;

    setCurrentPage(1);
    setIsLoading(true);
    const baseUrl = activeSubcategoryId
      ? `/api/categories/${activeSlug}/subcategories/${activeSubcategoryId}/products`
      : `/api/categories/${activeSlug}/products`;

    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "12");

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data);
        setTotalPages(data.pagination?.pages || 1);
      })
      .finally(() => setIsLoading(false));
  }, [activeSlug, activeSubcategoryId]);

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages) return;

    setIsLoading(true);
    setCurrentPage(page);
    const baseUrl = activeSubcategoryId
      ? `/api/categories/${activeSlug}/subcategories/${activeSubcategoryId}/products`
      : `/api/categories/${activeSlug}/products`;

    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", "12");

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data);
        setTotalPages(data.pagination?.pages || 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .finally(() => setIsLoading(false));
  };

  const activeCategory = categories.find((cat) => cat.slug === activeSlug);
  const subcategories = activeCategory?.subcategories || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* LEFT SIDEBAR */}
      <aside className="col-span-1">
        <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
        {subcategories.length > 0 ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveSubcategoryId(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition
                ${
                  activeSubcategoryId === null
                    ? "bg-[#0B2A6F] text-white"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                }
              `}
            >
              All Products
            </button>
            {subcategories.map((subcat) => (
              <button
                key={subcat.id}
                onClick={() => setActiveSubcategoryId(subcat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition flex items-center gap-2
                  ${
                    activeSubcategoryId === subcat.id
                      ? "bg-[#0B2A6F] text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }
                `}
              >
                <span>{subcat.icon || "📁"}</span>
                {subcat.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No subcategories available</p>
        )}
      </aside>

      {/* RIGHT PANEL */}
      <section className="col-span-1 md:col-span-3">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0B2A6F] mb-2">
            {activeSubcategoryId
              ? subcategories.find((s) => s.id === activeSubcategoryId)?.name
              : activeCategory?.name}
          </h2>
          <p className="text-sm text-gray-500">
            Showing {products.length} results
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="shadow-xl rounded-xl p-4 bg-white animate-pulse"
              >
                <div className="h-48 mb-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products in this category
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block"
                >
                  <div className="shadow-xl rounded-xl p-4 hover:shadow-lg transition bg-white cursor-pointer">
                    <div className="relative h-48 mb-4">
                      <Image
                        src={product.featureImage}
                        alt={product.title}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-semibold text-[#0B2A6F]">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? "bg-[#0B2A6F] text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
