'use client'

export default function ServiceHero() {
  return (
    <section
      className="w-full h-[260px] md:h-[320px] lg:h-[360px] relative bg-cover bg-center"
      style={{ backgroundImage: "url('/contact_bg_img.jpg')" }}   // background image
    >
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-white/10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="space-y-3">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0A2A3A]">
            Service & Support
          </h1>

          <p className="text-sm md:text-base text-gray-600">
            Home - Service & Support
          </p>

        </div>
      </div>
    </section>
  )
}
