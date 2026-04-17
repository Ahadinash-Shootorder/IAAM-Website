"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const applications = [
  {
    id: "overview",
    title: "Overview",
    icon: "/Service-icons/Group.svg",
    content:
      "Scandinavian Scientific Instruments (SSI) provides microscopes and laboratory instruments for a wide range of scientific, educational, medical, and industrial applications. Our solutions are developed for environments where accuracy, stability, and reliability are essential to daily work. SSI instruments are selected based on application needs rather than generic specifications. Each solution is configured to support consistent performance, dependable data generation, and long-term use across diverse laboratory settings. ",
  },
  {
    id: "research-development",
    title: "Research and development laboratories",
    icon: "/Service-icons/Support.svg",
    content:
      "SSI support is built around long-term usability. Instruments are designed for serviceability, and support processes are structured to keep laboratories operational with minimal disruption.Our approach emphasizes clear procedures, realistic response planning, and transparency in service actions.",
  },
  {
    id: "clinical-education",
    title: "Medical pathology and clinical education",
    icon: "/Service-icons/Installation.svg",
    content:
      "In pathology and clinical teaching environments, clarity and consistency are critical. SSI microscopes and instruments deliver reliable visualization and consistent performance, ideal for training, demonstrations, and routine examinations. Ergonomic design and reproducible imaging support both instructors and students while maintaining professional laboratory standards. ",
  },
  {
    id: "university",
    title: "University and teaching laboratories",
    icon: "/Service-icons/Maintenance.svg",
    content:
      "SSI solutions are widely used in academic teaching laboratories where instruments must be robust, intuitive, and suitable for multiple users. Stable operation, ergonomic handling, and durable construction make SSI instruments well-suited for student laboratories and practical training environments. ",
  },
  {
    id: "industrial",
    title: "Industrial analysis and quality control",
    icon: "/Service-icons/Spare-parts.svg",
    content:
      "Industrial laboratories require repeatable inspection, reliable documentation, and consistent performance. SSI instruments support quality control, inspection, and analytical workflows where accuracy and traceability are essential. Applications include manufacturing inspection, materials testing, and routine industrial analysis. ",
  },
  {
    id: "laboratories",
    title: "Shared-user and high-throughput laboratories",
    icon: "/Service-icons/support.svg",
    content:
      "SSI instruments are designed to perform reliably in shared-user facilities and high-throughput environments. Mechanical stability, repeatable settings, and serviceable design support consistent results across multiple operators and extended daily use. ",
  },
  {
    id: "digital",
    title: "Digital documentation and reporting environments",
    icon: "/Service-icons/Documentation.svg",
    content:
      "SSI instruments integrate with modern digital workflows to support image capture, data storage, and reporting. This is essential for laboratories operating under documentation requirements, teaching environments, and collaborative research settings. ",
  },
  {
    id: "application-driven",
    title: "SSI application-driven design philosophy",
    icon: "/Service-icons/Training.svg",
    content:
      "SSI designs products with application requirements in mind. Rather than adapting instruments to fit workflows, SSI develops solutions that support real laboratory practices, ensuring usability, reliability, and consistent performance across use cases. ",
  },
  {
    id: "choosing-setup",
    title: "Choosing the right application setup",
    icon: "/Service-icons/Lifecycle.svg",
    content:
      "SSI works with laboratories to identify the most suitable instrument configuration based on application type, sample characteristics, workflow requirements, and long-term usage expectations. ",
  },
  {
    id: "Commitment",
    title: "Commitment to response and continuity",
    icon: "/Service-icons/Commitment.svg",
    content:
      "SSI is committed to structured support responses and continuity of service. Our goal is to help laboratories maintain workflow stability and protect data integrity, even in demanding operating environments.",
  },
];

export default function ApplicationScrollSections() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 },
    );

    const allSections = document.querySelectorAll(".content-section");

    allSections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex gap-10 p-4">
      {/* LEFT SIDEBAR */}
      <aside className="w-[280px] sticky top-[100px] h-fit bg-[#f5f7f8] rounded-lg py-5 shadow-md">
        {applications.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`
            block px-6 py-3 text-[18px] leading-[1.4] transition-all duration-200
            ${
              activeSection === section.id
                ? "bg-[#e9eef2] border-l-4 border-[#1f3c44] font-semibold text-[#1f3c44]"
                : "border-l-4 border-transparent text-[#1f3c44]"
            }
          `}
          >
            {section.title}
          </a>
        ))}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1">
        {applications.map((section) => (
          <section
            id={section.id}
            key={section.id}
            className="p-10 content-section"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <Image
                src={section.icon}
                alt={section.title}
                width={28}
                height={28}
              />
              <h2 className="text-xl font-bold text-[24px]">{section.title}</h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-[20px]">
              {section.content}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
