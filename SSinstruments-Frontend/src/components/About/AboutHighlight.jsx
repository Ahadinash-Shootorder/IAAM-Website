"use client";

import Image from "next/image";

export default function AboutHighlightsSection() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Card 1 */}
          <div className="flex bg-white rounded-2xl shadow-md  overflow-hidden">
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-[#0B2B3C] mb-2">
                Innovative Growth
              </h3>
              <p className="text-[#6B7280] text-sm">
                Join a team where innovation, sustainability, and craftsmanship
                come together.
              </p>
            </div>

            {/* Image - Innovative Growth */}
            <div className="w-[180px] bg-gray-200 flex items-center justify-center">
              <Image
                src="/innovative-growth.svg"
                alt="Innovative Growth"
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex bg-white rounded-2xl shadow-md  overflow-hidden">
            {/* Image - Why Choose Us */}
            <div className="w-[180px] bg-gray-200 flex items-center justify-center">
              <Image
                src="/whychoose-us.svg"
                alt="Why Choose Us"
                width={80}
                height={80}
              />
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-[#0B2B3C] mb-2">
                Why Choose Us ?
              </h3>
              <p className="text-[#6B7280] text-sm">
                Everyday we empower growth, discovery, and
                sustainability—together.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom 3 Text Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <h4 className="font-semibold text-[#0B2B3C] mb-2">Global Impact</h4>
            <p className="text-[#6B7280] text-sm">
              Make a real difference with instruments shaping laboratories
              around the world.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#0B2B3C] mb-2">
              Collaborative Culture
            </h4>
            <p className="text-[#6B7280] text-sm">
              Work in an environment where ideas are valued, curiosity is
              fostered, and teamwork drives success.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#0B2B3C] mb-2">
              Rewarding Careers
            </h4>
            <p className="text-[#6B7280] text-sm">
              Flourish with opportunities where performance is recognized and
              growth is accelerated.
            </p>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-10">
          <span className="w-2 h-2 rounded-full bg-[#0B2B6F]"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
        </div>
      </div>
    </section>
  );
}
