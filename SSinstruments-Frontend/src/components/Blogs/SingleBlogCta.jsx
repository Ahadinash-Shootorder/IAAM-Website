"use client";

export default function SingleBlogCtaSection() {
  return (
    <section className="py-10 bg-[#f3f3f3]">
      <div className="w-full mx-auto">
        <div className="relative overflow-hidden  bg-gradient-to-r from-[#0B2A6F] to-indigo-800 py-20 px-6 text-center">
          {/* CONTENT */}
          <h2 className="text-3xl md:text-5xl font-semibold text-white max-w-3xl mx-auto mb-10">
            Get our stories delivered From us to your inbox weekly.
          </h2>

          {/* INPUT + BUTTON */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full sm:w-[350px] px-4 py-3 rounded-md outline-none text-gray-700 bg-[#ffffff]"
            />

            <button className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-[#0B2A6F] transition">
              Get started
            </button>
          </div>

          {/* SMALL TEXT */}
          <p className="text-sm text-white/80 max-w-xl mx-auto">
            Get a response tomorrow if you submit by 9pm today. If we received
            after 9pm will get a reponse the following day.
          </p>
        </div>
      </div>
    </section>
  );
}
