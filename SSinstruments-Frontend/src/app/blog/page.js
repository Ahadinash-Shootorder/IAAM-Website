"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogHero from "@/components/Blogs/BlogHero";
import BlogGrid from "@/components/Blogs/BlogGrid";
import SingleBlogCtaSection from "@/components/Blogs/SingleBlogCta";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHero />

      <BlogGrid blogs={blogs} />

      <SingleBlogCtaSection />
    </div>
  );
}
