"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NewReleaseSection() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;

        if (isInView) {
          contentRef.current.classList.add("reveal-on-scroll");
        }
      }

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;

        if (isInView) {
          setTimeout(() => {
            imageRef.current?.classList.add("reveal-on-scroll");
          }, 300);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="w-full bg-white px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 sm:gap-12 lg:gap-16  items-center">
          {/* ================= Left Content ================= */}
          <div ref={contentRef} className="space-y-4 sm:space-y-6">
            <span className="text-sm font-semibold text-black  uppercase tracking-wide animate-fadeUp">
              New Release
            </span>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0B2A6F] leading-tight animate-fadeUp"
              style={{ "--animation-delay": "0.1s" }}
            >
              Introducing the <br />
              Confocal Microscope <br />
              <span className="font-bold">CRYSTAL1000X</span>
            </h2>

            <h4
              className="text-lg font-medium text-gray-800 animate-fadeUp"
              style={{ "--animation-delay": "0.2s" }}
            >
              Crafted for Clarity Built for Discovery
            </h4>

            <p
              className="text-xl sm:text-base text-gray-600 
                      leading-relaxed max-w-xl 
                      mx-auto lg:mx-0 animate-fadeUp"
              style={{ "--animation-delay": "0.3s" }}
            >
              The Scandinavian design meets high-performance microscopy. We
              offer a complete range of imaging platforms, from
              classroom-friendly models to super-resolution confocal systems,
              built to meet the most demanding research and industrial
              standards.
            </p>

            <button
              className="bg-[#0B2A6F] text-white 
                           px-6 sm:px-7 
                           py-2.5 sm:py-3 
                           rounded-full font-semibold 
                           text-base
                           hover:bg-[#09225a] transition
                           w-full sm:w-auto animate-fadeUp
                           flex items-center gap-2 justify-center sm:justify-start"
              style={{ "--animation-delay": "0.4s" }}
            >
              <Link href="/products/cmm07bm3o0001uthg34ie9oj6">
                <span>Discover More</span>
                <span className="arrow-animate">→</span>
              </Link>
            </button>
          </div>

          {/* ================= Right Image ================= */}
          <div
            ref={imageRef}
            className="flex justify-center lg:justify-end opacity-0"
          >
            <div className="relative p-4 sm:p-6 rounded-md">
              <div className="relative w-[320px] sm:w-[380px] md:w-[420px] lg:w-[460px] xl:w-[500px] aspect-[4/5]">
                <Image
                  src="/new_microscope.png"
                  alt="Confocal Microscope CRYSTAL1000X"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
