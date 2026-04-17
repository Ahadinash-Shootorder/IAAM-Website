"use client";
import Link from "next/link";

export default function WhySSISection() {
  return (
    <section
      className="w-full bg-gray-100 px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-4xl font-semibold text-blue-900 mb-6">
              Why SSI?
            </h2>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Clear optics and stable mechanics for repeatable results
                </span>
              </li>

              <li className="flex gap-2">
                <span>•</span>
                <span>Configurations aligned to real research workflows</span>
              </li>

              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Durable systems designed for long-term laboratory use
                </span>
              </li>
            </ul>

            <button className="bg-blue-900 text-white px-6 py-3 rounded-full font-medium cursor-pointer transition">
              <Link href="/about">Learn More</Link>
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full">
            <img
              src="/new_microscope.png" // change to your image path
              alt="Microscope"
              className="w-[70%] h-[70%]  rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
