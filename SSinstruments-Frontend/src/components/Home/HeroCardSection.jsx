"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import RequestQuoteModal from "../Forms/RequestQuoteForm";

export default function HomeCardSection() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay =
              entry.target.dataset.delay || "0s";
            entry.target.classList.add("reveal-on-scroll");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const headingElement = headingRef.current;
    if (!headingElement) return;

    const wordSpans = headingElement.querySelectorAll(".word-span");
    const totalWords = wordSpans.length;

    const handleScroll = () => {
      const rect = headingElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = viewportHeight / 2;

      // Calculate progress: 0 when element is below center, 1 when fully above center
      let progress = 0;
      const distanceFromCenter = Math.abs(
        rect.top + rect.height / 2 - elementCenter,
      );
      const maxDistance = elementCenter;

      // Progress increases as element approaches center
      progress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance));

      // Reveal words based on progress with faster loading
      const wordsToReveal = Math.ceil(totalWords * progress);
      wordSpans.forEach((span, index) => {
        if (index < wordsToReveal) {
          span.classList.add("revealed");
          span.style.animationDelay = `${index * 0.03}s`;
        } else {
          span.classList.remove("revealed");
        }
      });
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-white">
      {/* ================= Top Cards ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 relative z-10 flex justify-center">
        <div className="flex justify-center w-full md:w-[80%]">
          {/* Microscopes Card */}
          <div
            ref={card1Ref}
            data-delay="0s"
            className="bg-[#0B2A6F] rounded-lg flex items-center justify-around
             p-6 
             card-hover
             w-full max-w-4xl"
          >
            <div className="bg-white p-3 rounded-md w-[140px] h-[140px] sm:w-[350px] sm:h-[300px] flex items-center justify-center card-image">
              <Image
                src="/microscope.jpg"
                alt="Microscopes"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>

            <div className="text-white space-y-3 text-center sm:text-left">
              <h3 className="text-xl sm:text-4xl font-semibold animate-fadeUp">
                Microscopes
              </h3>
              <button
                className="bg-white text-[#0B2A6F] 
                       px-5 py-2
                       sm : px-5 py-3 
                       rounded-full 
                       text-base font-semibold 
                       hover:bg-gray-100 transition
                       w-full sm:w-auto animate-fadeUp
                       flex items-center gap-2 justify-center sm:justify-start"
                style={{ "--animation-delay": "0.2s" }}
              >
                <Link href="/categories/microscopes">
                  <span>Discover More</span>
                </Link>
                <span className="arrow-animate">→</span>
              </button>
            </div>
          </div>

          {/* Lab Instruments Card */}
          {/* <div 
            ref={card2Ref}
            data-delay="0.1s"
            className="bg-[#0B2A6F] rounded-lg flex items-center p-4 sm:p-3 gap-4 sm:gap-6 card-hover">
            <div className="bg-white p-3 rounded-md w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] flex items-center justify-center card-image">
              <Image
                src="/top-card-2.jpg"
                alt="Lab Instruments"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>

            <div className="text-white space-y-3 text-center sm:text-left">
              <h3 className="text-xl font-semibold animate-fadeUp" style={{ '--animation-delay': '0.3s' }}>Lab Instruments</h3>
              <button className="bg-white text-[#0B2A6F] 
                       px-5 py-2 
                       rounded-full 
                       text-base font-semibold 
                       hover:bg-gray-100 transition
                       w-full sm:w-auto animate-fadeUp
                       flex items-center gap-2 justify-center sm:justify-start"
                style={{ '--animation-delay': '0.5s' }}>
                <span>Discover More</span>
                <span className="arrow-animate">→</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {/* ================= Brand Message Section ================= */}
      <div className="w-full mt-16 sm:mt-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{ backgroundImage: "url('/heroCardSection_bg_img.jpg')" }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 
                  py-16 sm:py-24 flex justify-center"
        >
          <div className="max-w-5xl bg-black/40 backdrop-blur-sm p-6 sm:p-10  rounded-lg text-white space-y-4 sm:space-y-6">
            <h2
              ref={headingRef}
              className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug"
            >
              <span className="word-span">Scandinavian</span>
              <span className="word-span">Scientific</span>
              <span className="word-span">Instruments</span>
              <span className="word-span">(SSI)</span>
              <span className="word-span">crafts</span>
              <span className="word-span">high-performance</span>
              <span className="word-span">instruments</span>
              <span className="word-span">that</span>
              <span className="word-span">empower</span>
              <span className="word-span">breakthroughs</span>
              <span className="word-span">across</span>
              <span className="word-span">disciplines.</span>
            </h2>

            <p
              className="text-white/90 leading-relaxed text-xl sm:text-base animate-fadeUp"
              style={{ "--animation-delay": "0.2s" }}
            >
              Rooted in Scandinavian precision, our mission is to advance
              science with clarity, sustainability, and trust.
            </p>

            <button
              className="bg-white text-[#0B2A6F] 
                         px-5 py-2.5 
                         rounded-full 
                         text-base font-semibold 
                         hover:bg-gray-100 transition
                         w-full sm:w-auto animate-fadeUp
                         flex items-center gap-2 justify-center sm:justify-start"
              style={{ "--animation-delay": "0.4s" }}
            >
              <span>View More</span>
              <span className="arrow-animate">→</span>
            </button>
          </div>
        </div>
      </div>

      {/*bottom section*/}
      <div className="w-full bg-[#0B2A6F]">
        <div
          className="max-w-7xl mx-auto 
                  px-4 sm:px-6 
                  py-8 sm:py-12 
                  flex flex-col md:flex-row 
                  items-center justify-between 
                  gap-4 sm:gap-6"
        >
          <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl md:text-left font-light animate-fadeUp">
            Speak to SS Instrument Expert
          </h2>

          <button
            onClick={() => setIsQuoteOpen(true)}
            className="bg-white text-[#0B2A6F] 
                       px-5 py-2.5 
                       rounded-full 
                       text-base font-semibold 
                       hover:bg-gray-100 transition
                       w-full sm:w-auto animate-fadeUp cursor-pointer"
            style={{ "--animation-delay": "0.2s" }}
          >
            Get In Touch
          </button>
          <RequestQuoteModal
            open={isQuoteOpen}
            onClose={() => setIsQuoteOpen(false)}
          />
        </div>
      </div>
    </section>
  );
}
