'use client'

import { FaMapMarkedAlt, FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa"

export default function ContactCardSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-[#EEF6F6] rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#0B2A6F] flex items-center justify-center text-white text-xl">
              <FaMapMarkedAlt />
            </div>

            <h3 className="text-xl font-semibold text-[#0A2A3A]">Our Address</h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Gamakilsvagen 8, <br />
              Ulrika 89053, Sweden
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#EEF6F6] rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#0B2A6F] flex items-center justify-center text-white text-xl">
              <FaEnvelope />
            </div>

            <h3 className="text-xl font-semibold text-[#0A2A3A]">Our Mail</h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              contact@ssinstruments.se 
              
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#EEF6F6] rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#0B2A6F] flex items-center justify-center text-white text-xl">
              <FaPhoneAlt />
            </div>

            <h3 className="text-xl font-semibold text-[#0A2A3A]">Our Contact</h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              +46 01313-2424 <br />
              
            </p>
          </div>

          {/* Card 4 */}
          {/* <div className="bg-[#EEF6F6] rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#0B2A6F] flex items-center justify-center text-white text-xl">
              <FaClock />
            </div>

            <h3 className="text-xl font-semibold text-[#0A2A3A]">Opening Hours</h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Mon - Fri : 09.00 - 18.00 <br />
              Sunday Closed
            </p>
          </div> */}

        </div>

      </div>
    </section>
  )
}
