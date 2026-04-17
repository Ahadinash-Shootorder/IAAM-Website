"use client";

import { useState } from "react";
import Link from "next/link";
import ContactHero from "@/components/Contact/ContactHeroSection";
import ContactCardSection from "@/components/Contact/ContactCards";
import MapSection from "@/components/Contact/ContactMap";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactHero />

      <ContactCardSection />

      <main>
        {/* <div className="mb-12">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium"
          >
            ← Back to Home
          </Link>
        </div> */}

        {/* <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Have a question or need assistance? We'd love to hear from you.
              Get in touch with our team and we'll get back to you as soon as
              possible.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <a
                  href="mailto:info@ssinstruments.com"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  info@ssinstruments.com
                </a>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  +1 (234) 567-890
                </a>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Address
                </h3>
                <p className="text-gray-600 text-lg">
                  123 Instrument Street
                  <br />
                  Tech City, TC 12345
                  <br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Business Hours
                </h3>
                <p className="text-gray-600 text-lg">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div> */}

        <div className="w-full bg-white py-2">
          <div className="max-w-6xl mx-auto px-6">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-medium text-[#0A2A3A] text-center mb-14">
              Send Message Anytime
            </h2>

            {/* Success Message */}
            {submitted && (
              <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg text-center">
                Thank you! Your message has been sent successfully. We&apos;ll
                be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Name"
                  className="w-full px-6 py-4 rounded-lg bg-[#EEF6F6] text-[#0A2A3A] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0B2A6F]"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email"
                  className="w-full px-6 py-4 rounded-lg bg-[#EEF6F6] text-[#0A2A3A] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0B2A6F]"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-6 py-4 rounded-lg bg-[#EEF6F6] text-[#0A2A3A] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0B2A6F]"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Subject"
                  className="w-full px-6 py-4 rounded-lg bg-[#EEF6F6] text-[#0A2A3A] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0B2A6F]"
                />
              </div>

              {/* Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Message"
                className="w-full px-6 py-5 rounded-lg bg-[#EEF6F6] text-[#0A2A3A] placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#0B2A6F] resize-none"
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2A6F] hover:bg-[#09225a] disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition"
              >
                {loading ? "Sending..." : "SEND"}
              </button>
            </form>
          </div>
        </div>

        <MapSection />
      </main>
    </div>
  );
}
