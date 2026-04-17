"use client"
import Image from "next/image";
export default function AboutContentSection() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Content */}
        <div>
          <h2 className="text-3xl font-semibold text-[#0B2B3C] mb-6">
            Integrity. Innovation. Global Vision.
          </h2>

          <p className="text-[#3A5568] leading-relaxed mb-6 text-[15px]">
            Scandinavian Scientific Instruments (SSI) designs and delivers advanced optical
            microscopy and laboratory instruments for research, medical pathology, education,
            and industrial analysis. Rooted in Scandinavian engineering values, SSI combines
            precision, reliability, and long-term sustainability to support modern, climate-
            efficient laboratories worldwide.
          </p>

          <p className="text-[#3A5568] leading-relaxed mb-10 text-[15px]">
            SSI was established to address a clear need: robust, high-quality scientific
            instruments that perform consistently, remain serviceable over long lifecycles,
            and integrate seamlessly into real laboratory workflows. Every SSI solution is
            developed with practical use, accuracy, and durability at its core.
          </p>

          <h3 className="text-2xl font-semibold text-[#0B2B3C] mb-4">
            What We Do?
          </h3>

          <p className="text-[#3A5568] leading-relaxed mb-4 text-[15px]">
            SSI provides a focused portfolio of optical microscopes and laboratory instruments
            designed for clarity, stability, and dependable performance. Our solutions support
            routine laboratory work and advanced analytical and research applications, ensuring
            confidence in observation, measurement, and data quality.
          </p>

          <p className="text-[#3A5568] mb-3 text-[15px]">
            Our product development emphasizes:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-[#3A5568] text-[15px]">
            <li>Optical precision and mechanical stability</li>
            <li>Ergonomic and user-centered design</li>
            <li>Modular configurations for flexible use</li>
            <li>Long service life with reduced environmental impact</li>
          </ul>
        </div>

        {/* Right Image / Placeholder */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md h-[300px] bg-gray-300 rounded-2xl shadow-sm">
            {/* Replace with <Image /> later */}
            <Image src="/about-img.jpg" alt="About Us" width={500} height={520} className="object-cover rounded-2xl" />
          </div>
        </div>

      </div>
    </section>
  );
}
