"use client"

import BlogCard from "./BlogCard";

export default function BlogGrid({ blogs }) {
  return (
    <section className="bg-[#f3f3f3] pb-20">
      <div className="max-w-6xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs?.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>

      </div>
    </section>
  );
}
