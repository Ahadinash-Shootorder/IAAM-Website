"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState("microscopes");
  const [isAnimating, setIsAnimating] = useState(false);
  const [products, setProducts] = useState([]);
  const cardsRef = useRef([]);

  /* ================= Fetch Products ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  /* ================= Tab Logic ================= */
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => setActiveTab(tab), 150);
      setTimeout(() => setIsAnimating(false), 750);
    }
  };

  /* ================= Category Filtering ================= */
  const microscopes = products
    .filter(
      (p) =>
        typeof p.category === "string" &&
        p.category.toLowerCase() === "microscopes",
    )
    .slice(0, 3);

  const labInstruments = products
    .filter(
      (p) =>
        typeof p.category === "string" &&
        p.category.toLowerCase() !== "microscopes",
    )
    .slice(0, 3);

  const activeProducts =
    activeTab === "microscopes" ? microscopes : labInstruments;

  /* ================= Scroll Animation ================= */
  useEffect(() => {
    const handleScroll = () => {
      cardsRef.current.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;

        if (isInView) {
          card.classList.add("card-in-view");
        } else {
          card.classList.remove("card-in-view");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeProducts]);

  return (
    <section
      className="w-full bg-[#F5F5F5] px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-10 
          mb-10 sm:mb-12 
          px-4 sm:px-8 md:px-12 lg:px-16"
        >
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0B2A6F] animate-fadeUp">
              Our Featured Products
            </h2>

            <p
              className="text-xl sm:text-base text-gray-600 leading-relaxed animate-fadeUp"
              style={{ "--animation-delay": "0.1s" }}
            >
              From advanced optical systems to sustainable lab solutions, SSI
              delivers instruments that combine precision, clarity, and
              eco-conscious innovation.
            </p>

            {/* Tabs */}
            <div className="inline-flex bg-[#0B2A6F] p-1 rounded-lg mx-auto lg:mx-0">
              <button
                onClick={() => handleTabChange("microscopes")}
                className={`px-4 sm:px-6 py-2 rounded-md text-base font-semibold transition ${
                  activeTab === "microscopes"
                    ? "bg-white text-[#0B2A6F]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Microscopes
              </button>

              {/* <button
                onClick={() => handleTabChange("lab")}
                className={`px-4 sm:px-6 py-2 rounded-md text-base font-semibold transition ${
                  activeTab === "lab"
                    ? "bg-white text-[#0B2A6F]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Lab Instruments
              </button> */}
            </div>
          </div>
        </div>

        {/* ================= Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeProducts.map((item, index) => (
            <Link key={item.id} href={`/products/${item.id}`}>
              <div
                ref={(el) => (cardsRef.current[index] = el)}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col shadow-xl justify-between card-hover bg-white cursor-pointer transition transform hover:shadow-2xl ${
                  isAnimating ? "animate-fadeUp" : ""
                }`}
                style={{
                  "--animation-delay": isAnimating
                    ? `${0.1 * (index + 1)}s`
                    : "0s",
                }}
              >
                {/* Image */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center h-[180px] sm:h-[220px] card-image">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.featureImage || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-3 text-[#0B2A6F] text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-sm text-[#0B2A6F]/80">
                    {item.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
