"use client"

export default function BlogHero({
  eyebrow = "OUR BLOGS",
  title = "Find our all blogs from here",
  description = "our blogs are written from very research research and well known writers writers so that we can provide you the best blogs and articles articles for you to read them all along",
}) {
  return (
    <section className="w-full bg-[#f3f3f3] py-20 mb-8">
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Small Heading */}
        <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-6">
          {eyebrow}
        </p>

        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 mb-6">
          {title}
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-500 leading-relaxed">
          {description}
        </p>

      </div>
    </section>
  );
}
