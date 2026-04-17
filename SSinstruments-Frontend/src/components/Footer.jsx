"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* ================= Top CTA Bar ================= */}
      <div className="w-full bg-[#0B2A6F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-light">
            Need Assistance?
          </h2>

          <button className="bg-white text-[#0B2A6F] px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            <Link href="/contact">Contact SS Instruments</Link>
          </button>
        </div>
      </div>

      {/* ================= Main Footer ================= */}
      <div className="w-full bg-[#E5E5E5]">
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 py-10 sm:py-16">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16 items-start text-center sm:text-left">
            {/* -------- Column 1 -------- */}
            <div className="flex flex-col items-center sm:items-start space-y-5 sm:space-y-6">
              {/* Logo */}
              <div className="relative w-[100px] h-[30px]">
                <Image
                  src="/footer-logo.png" // your logo path
                  alt="Scandinavian Scientific Instruments"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Links */}
              <ul className="space-y-3 text-sm text-[#0B2A6F]">
                <li>
                  <a href="/about" className="hover:underline">
                    About SS Instruments
                  </a>
                </li>
                <li>
                  <a href="/applications" className="hover:underline">
                    Applications & Solutions
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:underline">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">
                    Learn
                  </a>
                </li>
                <li>
                  <a href="/service" className="hover:underline">
                    Support
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li> */}
              </ul>
            </div>

            {/* -------- Column 2 -------- */}
            <div className="flex flex-col mt-14 items-center sm:items-start">
              <ul className="space-y-4 text-sm text-[#0B2A6F]">
                <li>
                  <a href="/products/cmm07bm3o0001uthg34ie9oj6" className="hover:underline">
                    Confocul Microscopes
                  </a>
                </li>
                <li>
                  <a href="/products/cmm09lp66000cutm4p73bchoo" className="hover:underline">
                    Inverted Biological Microscopes
                  </a>
                </li>
                <li>
                  <a href="/products/cml7ozjqw0003ut407h8euyq5" className="hover:underline">
                    Metallurgical Microscopes
                  </a>
                </li>
                <li>
                  <a href="/products/cml7nw4ta0008utn8h9hd154t" className="hover:underline">
                    Research Stereo Microscopes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Objective Finder
                  </a>
                </li>
              </ul>
            </div>

            {/* -------- Column 3 -------- */}
            <div className="flex flex-col mt-14 items-center sm:items-start">
              <ul className="space-y-4 text-sm text-[#0B2A6F]">
                <li>
                  <a href="#" className="hover:underline">
                    Image of the Year
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Microscope Resource Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Customer Service Microscope
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Software Downloads
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Discontinued Products
                  </a>
                </li>
              </ul>
            </div>

            {/* -------- Column 4 -------- */}
            <div className="flex flex-col mt-14 items-center sm:items-start">
              <ul className="space-y-4 text-sm text-[#0B2A6F]">
                <li>
                  <a href="#" className="hover:underline">
                    Image of the Year
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Microscope Resource Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Customer Service Microscope
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Software Downloads
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Discontinued Products
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ================= Bottom Bar ================= */}
          <div className="border-t border-[#0B2A6F]/20 mt-10 sm:mt-12 pt-6 text-xs text-center text-xs text-[#0B2A6F]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-3">
              {/* Social Icons */}
              <div className="flex gap-4 pt-2 sm:pt-4">
                <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center font-semibold cursor-pointer hover:opacity-80">
                  <FaInstagram size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center font-semibold cursor-pointer hover:opacity-80">
                  <FaFacebookF size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0B2A6F] text-white flex items-center justify-center font-semibold cursor-pointer hover:opacity-80">
                  <FaLinkedinIn size={18} />
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <a href="#" className="hover:underline">
                  Terms of Use
                </a>
                <span>|</span>
                <a href="#" className="hover:underline">
                  Privacy Notice
                </a>
                <span>|</span>
                <a href="#" className="hover:underline">
                  Cookie Notice
                </a>
                <span>|</span>
                <a href="#" className="hover:underline">
                  Report Compliance Concern
                </a>
                <span>|</span>
                <a href="#" className="hover:underline">
                  German Imprint
                </a>
                <span>|</span>
                <a href="#" className="hover:underline">
                  Cookie Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
