"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RequestQuoteModal from "@/components/Forms/RequestQuoteForm";
import SpecificationTable from "@/components/SpecificationTable";
import ProductOverviewSections from "@/components/ProductLayouts/ProductDescriptionSection";

const TABS = ["Description", "Specification", "Applications"];

export default function ProductPage() {
  const params = useParams();
  const { id } = params;

  const stickyTriggerRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");
  const [activeImage, setActiveImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(false);

  const descriptionRef = useRef(null);
  const specificationRef = useRef(null);
  const applicationsRef = useRef(null);

  const scrollToSection = (tab) => {
    let ref = null;

    if (tab === "Description") ref = descriptionRef;
    if (tab === "Specification") ref = specificationRef;
    if (tab === "Applications") ref = applicationsRef;

    if (ref?.current) {
      const offset = 130; // adjust for sticky header height
      const top =
        ref.current.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  /* ================= Sticky Tabs ================= */
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyTriggerRef.current) return;
      const triggerTop = stickyTriggerRef.current.getBoundingClientRect().top;
      setIsStickyActive(triggerTop <= 96);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Fetch Product ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  /* ================= Gallery ================= */
  const gallery = [
    product.featureImage,
    ...(product.galleryImages || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* ================= Breadcrumb ================= */}
      <div className="bg-gray-100 py-3 px-6 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ================= Top Section ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* ================= Gallery ================= */}
          <div className="flex gap-5">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 border rounded-md 
                    flex items-center justify-center 
                    cursor-pointer bg-white
                    transition-all duration-200
                    ${
                      activeImage === i
                        ? "border-blue-700 ring-2 ring-blue-300 scale-105"
                        : "border-gray-200 hover:scale-105"
                    }`}
                >
                  <img src={img} alt="" className="object-contain h-full" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-6">
              <img
                key={activeImage}
                src={gallery[activeImage]}
                alt={product.title}
                className="max-h-[400px] object-contain transition-opacity duration-300"
              />
            </div>
          </div>

          {/* ================= Product Info ================= */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              {product.title}
            </h1>

            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              {product.description}
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0B2A6F] hover:bg-blue-900 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm"
            >
              Request Quote
            </button>
          </div>
        </div>

        {/* ===== Sticky Scope Wrapper ===== */}
        <div className="mt-12 relative">
          <div ref={stickyTriggerRef} className="h-[1px]" />

          {/* Sticky Tabs Bar */}
          <div className="w-full sticky top-[80px] z-40 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-center h-[64px]">
                <div className="flex gap-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        scrollToSection(tab);
                      }}
                      className={`px-8 py-2 rounded-full border-2
                        ${
                          activeTab === tab
                            ? "bg-[#0B2A6F] text-white border-blue-600"
                            : "bg-transparent text-blue-600 border-blue-600"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div
                  className={`flex items-center gap-6 transition-all duration-300
                    ${
                      isStickyActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6 pointer-events-none"
                    }`}
                >
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#0B2A6F] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm"
                  >
                    Request Quote
                  </button>

                  <Link
                    href="/contact"
                    className="bg-[#0B2A6F] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Tab Content ================= */}
          <div
            className={`max-w-7xl mx-auto px-6 py-10 space-y-20 transition-colors duration-300
              ${isStickyActive ? "bg-gray-100" : "bg-white"}
              `}
          >
            {/* Description */}
            <div ref={descriptionRef}>
              <div
                dangerouslySetInnerHTML={{
                  __html: product.overview,
                }}
                className="w-full px-6 py-10 space-y-10"
              />

              <ProductOverviewSections sections={product.overviewSections} />
            </div>

            {/* Specification */}
            <div ref={specificationRef}>
              <SpecificationTable data={product.technicalSpecification} />
            </div>

            {/* Applications */}
            <div ref={applicationsRef}>
              <div
                dangerouslySetInnerHTML={{
                  __html: product.application,
                }}
                className="w-full px-6 py-10 space-y-10"
              />
            </div>
          </div>
        </div>
      </div>

      <RequestQuoteModal
        open={showForm}
        onClose={() => setShowForm(false)}
        product={product}
      />
    </div>
  );
}
