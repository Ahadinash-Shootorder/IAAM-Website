"use client";

import { useState } from "react";

export default function RequestQuoteModal({ open, onClose, product }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/zoho/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productName: product?.product_name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quote request");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form");
      console.error("Error submitting quote:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-xl shadow-xl 
                   w-[92%] max-w-md 
                   p-6 sm:p-7 z-10 
                   animate-scaleIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Request a Quote
            </h3>
            {product?.product_name && (
              <p className="text-xs text-gray-500 mt-1">
                For: {product.product_name}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-medium"
          >
            ✕
          </button>
        </div>
        <div className="w-full h-[520px]">
          <iframe
            aria-label="Contact Us"
            src="https://forms.zohopublic.eu/contactssinst1/form/ContactUs/formperma/e9yVpx8STQSA5uzAwyNBDzi0TmPG7OkVDKuiG_BWRJM%27"
            className="w-[99%] h-[500px] border-0"
          />
        </div>

        {/* {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Quote request submitted successfully!
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
              className="w-full border rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full border rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

         
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder=" (+46) – 01313-2424"
              disabled={loading}
              className="w-full border rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Your Subject"
              className="w-full border rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              name="message"
              rows="3"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              disabled={loading}
              className="w-full border rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
            ></textarea>
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 
                       text-white py-2.5 rounded-md 
                       font-semibold text-sm transition
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form> */}
      </div>
    </div>
  );
}
