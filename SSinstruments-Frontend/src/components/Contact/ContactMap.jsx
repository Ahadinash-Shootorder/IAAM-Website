"use client";

export default function MapSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className=" px-6">
        <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.532393729504!2d15.431184237157456!3d58.12579859069658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46599d1c4e9a81b3%3A0x6b7478e82f5babdf!2sGammalkilsv%C3%A4gen%208%2C%20590%2053%20Ulrika%2C%20Sweden!5e0!3m2!1sen!2sin!4v1772186008713!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
      </div>
    </section>
  );
}
