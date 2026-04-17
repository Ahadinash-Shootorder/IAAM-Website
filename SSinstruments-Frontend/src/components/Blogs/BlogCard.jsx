"use client";

import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ blog }) {
  return (
    <div className="group">
      {/* Image */}
      <Link href={`/blog/${blog.slug}`}>
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Category + Date */}
      <p className="text-xs text-gray-500 mb-2">
        {blog.category} • {blog.date}
      </p>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-2 leading-snug line-clamp-1">
        {blog.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-gray-500 mb-3 line-clamp-3 min-h-[72px]">
        {blog.excerpt}
      </p>

      <div className="flex justify-between  items-center py-6 mb-4 border-t ">
        <div className="flex  gap-2 items-center">
          <img
            src={blog.authorImage}
            alt={blog.author}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-500">{blog.author}</span>
        </div>
        <div>
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-2 bg-[#0B2A6F] text-sm text-white px-3 py-3 rounded-lg font-semibold hover:bg-[#09225a] transition"
          >
            <span>Read More</span>
            <span className="bg-white text-[#0B2A6F] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
