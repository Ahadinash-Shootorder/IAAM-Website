"use client";

export default function ApplicationAssistance() {
  return (
    <section className="w-full flex justify-end items-end px-16 py-10">
      <div className="w-6xl border border-[#2f4ea2] rounded-xl bg-[#eef2f3] p-8 ">
        <h2 className="text-3xl font-semibold text-[#1f3c44] mb-4">
          Explore SSI microscopes and laboratory instruments
        </h2>

        <p className="text-gray-600 max-w-3xl mb-6 leading-relaxed">
          Explore SSI microscopes and laboratory instruments or contact
          Scandinavian Scientific Instruments for guidance on selecting the
          right solution for your application.
        </p>

        <div className="flex gap-4">
          {/* Primary Button */}
          <button className="px-6 py-2.5 rounded-full bg-[#1f3c88] text-white font-medium hover:bg-[#17306d] transition">
            Explore Now
          </button>

          {/* Secondary Button */}
          <button className="px-6 py-2.5 rounded-full border border-[#1f3c88] text-[#1f3c88] font-medium hover:bg-[#e4e9ff] transition">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
