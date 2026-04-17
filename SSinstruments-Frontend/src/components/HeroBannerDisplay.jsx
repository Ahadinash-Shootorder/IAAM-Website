"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Fallback hero banner data - customize these images and content as needed
const FALLBACK_SLIDES = [
  {
    heading: "Welcome to SS Instruments",
    subheading: "Precision microscopes and laboratory instruments engineered for sustainable research, analytical accuracy, reliable data, and long-term operational life.​",
    buttonLabel: "Learn More",
    buttonUrl: "/",
    bannerImage: "/hero-slider-1.jpg", // Replace with your image path
  },
  {
    heading: "Industry Leading Quality",
    subheading: "Precision microscopes and laboratory instruments engineered for sustainable research, analytical accuracy, reliable data, and long-term operational life.​",
    buttonLabel: "Learn More",
    buttonUrl: "/",
    bannerImage: "/hero-slider-2.jpg", // Replace with your image path
  },
  {
    heading: "Advanced Technology",
    subheading: "Precision microscopes and laboratory instruments engineered for sustainable research, analytical accuracy, reliable data, and long-term operational life.​",
    buttonLabel: "Learn More",
    buttonUrl: "/",
    bannerImage: "/hero-slider-3.jpg", // Replace with your image path
  },
];

export default function HeroBannerDisplay({ data }) {
  let bannerData = {};

  try {
    if (typeof data === "string") {
      bannerData = JSON.parse(data);
    } else if (typeof data === "object") {
      bannerData = data;
    }
  } catch {
    bannerData = null;
  }

  let slides = [];
  if (bannerData) {
    slides = Array.isArray(bannerData) ? bannerData : [bannerData];
  }

  const validSlides = slides.filter(
    (slide) =>
      slide.heading ||
      slide.subheading ||
      slide.buttonLabel ||
      slide.bannerImage,
  );

  // Use fallback slides if no valid backend data
  const displaySlides = validSlides.length > 0 ? validSlides : FALLBACK_SLIDES;

  if (displaySlides.length === 1) {
    const { heading, subheading, buttonLabel, buttonUrl, bannerImage } =
      displaySlides[0];
    return (
      <section className="relative w-full h-[500px] overflow-hidden bg-black">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={heading || "Banner"}
            fill
            className="object-cover"
            priority
          />
        )}

        {bannerImage && <div className="absolute inset-0 bg-black/40" />}

        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-white">
            {heading && (
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {heading}
              </h1>
            )}

            {subheading && (
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                {subheading}
              </p>
            )}

            {buttonLabel && buttonUrl && (
              <Link
                href={buttonUrl}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                {buttonLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full bg-black overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="w-full h-full"
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {slide.bannerImage && (
                <Image
                  src={slide.bannerImage}
                  alt={slide.heading || `Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              )}
              {slide.bannerImage && (
                <div className="absolute inset-0 bg-black/40" />
              )}

              <div className="relative z-10 max-w-5xl  px-4 sm:px-8 md:px-16 h-full flex items-center">
                <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                  {slide.heading && (
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                      {slide.heading}
                    </h1>
                  )}

                  {slide.subheading && (
                    <p className="text-base md:text-md lg:text-lg text-white/90 leading-relaxed">
                      {slide.subheading}
                    </p>
                  )}

                  {slide.buttonLabel && slide.buttonUrl && (
                    <Link
                      href={slide.buttonUrl}
                      className="inline-block bg-white text-black text-md px-6 py-3 rounded-3xl font-semibold transition hover:bg-gray-100"
                    >
                      {slide.buttonLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
