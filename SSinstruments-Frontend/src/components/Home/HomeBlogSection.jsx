"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/Blogs/BlogCard";

export default function HomeBlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data.slice(0, 3)); // only 3 blogs for homepage
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading || !blogs.length) return null;

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-medium text-black">Expert Insights</h2>

          <Link href="/blog">
            <button className="bg-[#0B2A6F] text-white px-7 py-3 rounded-full font-semibold text-base hover:bg-[#09225a] transition">
              View All Blogs
            </button>
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
