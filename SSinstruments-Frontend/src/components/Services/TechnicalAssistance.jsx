"use client";

export default function TechnicalAssistance() {
  return (
    <section className="w-full flex justify-end items-end px-16 py-10">
      <div className="w-6xl border border-[#2f4ea2] rounded-xl bg-[#eef2f3] p-8 ">
        <h2 className="text-3xl font-semibold text-[#1f3c44] mb-4">
          Need Technical Assistance?
        </h2>

        <p className="text-gray-600 max-w-3xl mb-6 leading-relaxed">
          For service inquiries, maintenance guidance, or technical support,
          contact Scandinavian Scientific Instruments (SSI). Our team will
          assist you in maintaining reliable performance across your laboratory
          instruments.
        </p>

        <div className="flex gap-4">
          {/* Primary Button */}
          <button className="px-6 py-2.5 rounded-full bg-[#1f3c88] text-white font-medium hover:bg-[#17306d] transition">
            Contact Us
          </button>

          {/* Secondary Button */}
          <button className="px-6 py-2.5 rounded-full border border-[#1f3c88] text-[#1f3c88] font-medium hover:bg-[#e4e9ff] transition">
            Explore Instruments
          </button>
        </div>
      </div>
    </section>
  );
}
