"use client";

import Link from "next/link";
import AboutHeroSection from "@/components/About/AboutHero";
import AboutContentSection from "@/components/About/AboutContent";
import AboutValuesSection from "@/components/About/AboutValues";
import AboutHighlightsSection from "@/components/About/AboutHighlight";


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutHeroSection />

      <AboutContentSection />

      <AboutValuesSection />

      <AboutHighlightsSection />
      {/* <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About SS Instruments
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <p>
                Founded in 2010, SS Instruments has been a leading provider of
                high-quality instruments and equipment for over a decade. We
                started with a passion for precision and excellence, serving
                customers across the globe.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
                Our Mission
              </h2>
              <p>
                Our mission is to provide top-quality instruments and equipment
                that meet the highest standards of precision, reliability, and
                durability. We are committed to delivering exceptional customer
                service and supporting our clients in their professional
                endeavors.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
                Why Choose Us?
              </h2>
              <ul className="list-disc list-inside space-y-3">
                <li>
                  <strong>Quality Assurance:</strong> Every product is tested
                  for quality and performance
                </li>
                <li>
                  <strong>Expert Team:</strong> Our team has decades of combined
                  experience in the industry
                </li>
                <li>
                  <strong>Wide Selection:</strong> We offer a comprehensive
                  range of instruments for various needs
                </li>
                <li>
                  <strong>Customer Support:</strong> Dedicated support team
                  available 24/7
                </li>
                <li>
                  <strong>Competitive Pricing:</strong> Best prices without
                  compromising quality
                </li>
                <li>
                  <strong>Fast Shipping:</strong> Reliable and quick delivery
                  worldwide
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
                Our Values
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Integrity
                  </h3>
                  <p>
                    We operate with honesty and transparency in all our business
                    dealings.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Excellence
                  </h3>
                  <p>
                    We strive for excellence in everything we do, from product
                    quality to customer service.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Innovation
                  </h3>
                  <p>
                    We continuously innovate to bring the latest technologies
                    and solutions to our customers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
                Contact Information
              </h2>
              <p>
                Have questions about SS Instruments? We'd love to hear from you!
              </p>
              <p className="mt-4">
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Get in touch with our team →
                </Link>
              </p>
            </section>
          </div>
        </div> 
      </main>*/}
    </div>
  );
}
