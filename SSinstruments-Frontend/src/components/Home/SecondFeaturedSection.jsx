"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SecondFeaturedSection() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isInView) {
          contentRef.current.classList.add('reveal-on-scroll');
        }
      }

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isInView) {
          setTimeout(() => {
            imageRef.current?.classList.add('reveal-on-scroll');
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full bg-white px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ================= Left Content ================= */}
          <div ref={contentRef} className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0B2A6F] leading-tight animate-fadeUp">
              Intelligent Instruments <br />
              for Sustainable Science <br />
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl animate-fadeUp" style={{ '--animation-delay': '0.1s' }}>
              EcoNord is our flagship line of low-carbon laboratory instruments
              designed to meet the needs of modern research, education, biotech,
              and pharmaceutical industries.
            </p>

            <button className="bg-[#0B2A6F] text-white 
                           px-6 sm:px-7 
                           py-2.5 sm:py-3 
                           rounded-full font-semibold 
                           text-base
                           hover:bg-[#09225a] transition
                           w-full sm:w-auto animate-fadeUp
                           flex items-center gap-2 justify-center sm:justify-start" style={{ '--animation-delay': '0.2s' }}>
              <span>Learn More</span>
              <span className="arrow-animate">→</span>
            </button>
          </div>

          {/* ================= Right Image ================= */}
          <div ref={imageRef} className="flex justify-center lg:justify-end opacity-0">
            <div className="relative ">
              <Image
                src="/second-featured_img.png"
                alt="EcoNord Lab Instruments"
                className="object-contain"
                priority
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
