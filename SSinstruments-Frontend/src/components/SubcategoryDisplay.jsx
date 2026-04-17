"use client";

import Link from "next/link";

export default function SubcategoryDisplay({ categorySlug, subcategories }) {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Subcategories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categorySlug}/subcategories/${sub.slug}`}
          >
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer h-full">
              <div className="flex items-start gap-3">
                <span className="text-4xl">{sub.icon || "📁"}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {sub.description}
                    </p>
                  )}
                  {sub.productCount > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      {sub.productCount} product{sub.productCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
