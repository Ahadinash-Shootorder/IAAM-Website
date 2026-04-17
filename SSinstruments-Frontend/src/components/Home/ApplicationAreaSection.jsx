"use client";

import Image from "next/image";
import Link from "next/link";

export default function ApplicationAreaSection() {
  const areas = [
    {
      title: "Designed for every frontier of science",
      img: "/application-img-1.png",
    },
    {
      title: "Education & Training",
      img: "/application-img-2.png",
    },
    {
      title: "Metallurgy & Material Science",
      img: "/application-img-3.png",
    },
    {
      title: "Metallurgy & Material Science",
      img: "/application-img-4.png",
    },
  ];

  return (
    <section className="w-full bg-[#0B2A6F]">
      {/* ================= Header ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20  text-white">
        <p className="text-base sm:text-sm uppercase tracking-wide text-white/80 mb-2 sm:mb-3 animate-fadeUp">
          Application Area
        </p>

        <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight animate-fadeUp" style={{ '--animation-delay': '0.1s' }}>
          Designed for every <br />
          frontier of science
        </h2>
      </div>

      {/* ================= Grid ================= */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((item, index) => (
          <div key={index} className="relative h-[400px] sm:h-[450] lg:h-[500px] group overflow-hidden">
            {/* Background Image */}
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay 
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition"></div>*/}

            {/* Content */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              {/* Blur content box */}
              <div
                className="flex items-center justify-between
                  bg-black/20 
                  backdrop-blur-[3px]
                  rounded-lg px-4 sm:px-5 py-3 sm:py-4">

                <h3 className="text-white text-xl sm:text-xl md:text-lg font-semibold leading-snug max-w-[70%] animate-fadeUp" style={{ '--animation-delay': `${0.15 * (index + 1)}s` }}>
                  Designed for every frontier of science
                </h3>

                {/* Arrow button */}
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10  rounded-full bg-white/40 backdrop-blur
                       flex items-center justify-center text-white text-base
                       hover:bg-white hover:text-[#0B2A6F] transition"
                >
                  <Link href="/applications" className="text-lg font-bold animate-fadeUp">
                  →
                  </Link>
                  
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
