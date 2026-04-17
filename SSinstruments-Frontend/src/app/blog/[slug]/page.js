"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BlogGrid from "@/components/Blogs/BlogGrid";
import SingleBlogCtaSection from "@/components/Blogs/SingleBlogCta";

export default function BlogSinglePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const blogRes = await fetch(`/api/blogs/${slug}`);
        const blogData = await blogRes.json();
        setBlog(blogData);

        const allBlogsRes = await fetch("/api/blogs");
        const allBlogs = await allBlogsRes.json();
        let related = allBlogs
          .filter((b) => b.slug !== slug && b.category === blogData.category)
          .slice(0, 3);
        if (related.length === 0) {
          related = allBlogs
            .filter((b) => b.slug !== slug)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        setRelatedBlogs(related);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blog post not found
          </h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      {/* MAIN BLOG */}
      <div className="bg-[#f3f3f3] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* CATEGORY + DATE */}
          <p className="text-sm text-gray-500 mb-3 text-center">
            {blog.category} • {blog.date}
          </p>

          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-semibold text-center text-gray-800 mb-10">
            {blog.title}
          </h1>

          {/* IMAGE */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[500px] rounded-xl mb-10"
          />

          {/* CONTENT */}
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {blog?.content?.split("\n\n")?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED POSTS */}
      <section className="bg-[#f3f3f3] py-20">
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-[#0B2A6F]">
              Popular Post
            </h2>
            <Link
              href="/blog"
              className="bg-[#0B2A6F] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              View All
            </Link>
          </div>
        </div>
        <BlogGrid blogs={relatedBlogs} />
      </section>

      {/*bottom CTA section*/}
      <SingleBlogCtaSection />
    </div>
  );
}
