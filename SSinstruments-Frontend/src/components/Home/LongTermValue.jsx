"use client"

export default function LongTermValueSection() {
  return (
    <section className="w-full bg-[#0A2471] px-4 sm:px-10 md:px-16 lg:px-20 
                    py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left IMAGE */}
          <div className="w-full">
            <img
              src="/new_microscope.png"   // change to your image path
              alt="Microscope"
              className="w-[70%] h-[70%] rounded-lg object-cover"
            />
          </div>

          {/* Right CONTENT */}
          <div>
            <h2 className="text-4xl font-semibold text-white mb-6">
              Long Term Value
            </h2>

            <ul className="space-y-3 text-white mb-8">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Stable optics and mechanics for repeatable results.
                </span>
              </li>

              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Configurations optimized for reflected-light applications
                </span>
              </li>

              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Repeatable results across operators and shifts.
                </span>
              </li>
            </ul>

            <button className="bg-white text-[#0A2471] px-6 py-3 rounded-full font-medium cursor-pointer">
              Learn More
            </button>
          </div>

          

        </div>
      </div>
    </section>
  );
}
