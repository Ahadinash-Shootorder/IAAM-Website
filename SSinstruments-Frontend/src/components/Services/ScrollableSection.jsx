"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: "/Service-icons/Group.svg",
    content:
      "Scandinavian Scientific Instruments (SSI) provides structured service and support to ensure reliable instrument performance throughout the product lifecycle. Our support model is designed to minimize downtime, protect data quality, and extend the operational life of microscopes and laboratory instruments in professional environments.Service at SSI is practical and predictable, focusing on preventive care, timely response, and clear communication rather than reactive fixes.",
  },
  {
    id: "support",
    title: "Support Philosophy",
    icon: "/Service-icons/Support.svg",
    content:
      "SSI support is built around long-term usability. Instruments are designed for serviceability, and support processes are structured to keep laboratories operational with minimal disruption.Our approach emphasizes clear procedures, realistic response planning, and transparency in service actions.",
  },
  {
    id: "installation",
    title: "Installation and commissioning",
    icon: "/Service-icons/Installation.svg",
    content:
      "SSI provides guidance during installation and commissioning to ensure instruments are properly configured from the outset. Proper alignment, configuration, and verification help establish stable performance and reduce early-stage operational issues.This ensures instruments enter service in optimal working conditions.",
  },
  {
    id: "maintenance",
    title: "Preventive maintenance and calibration support",
    icon: "/Service-icons/Maintenance.svg",
    content:
      "Regular maintenance is essential for consistent performance. SSI supports preventive maintenance and calibration practices to help laboratories maintain accuracy, stability, and compliance with internal quality requirements.Maintenance guidance is aligned with real-world laboratory usage patterns rather than rigid schedules.",
  },
  {
    id: "spare-parts",
    title: "Spare parts and serviceability",
    icon: "/Service-icons/Spare-parts.svg",
    content:
      "SSI instruments are built with serviceable architectures. Planned availability of spare parts and modular components allows efficient repairs and reduces extended downtime.This service-friendly design supports long-term ownership and predictable maintenance planning.",
  },
  {
    id: "technical-support",
    title: "Technical support and troubleshooting",
    icon: "/Service-icons/support.svg",
    content:
      "SSI technical support assists with operational questions, performance issues, and troubleshooting. Support focuses on identifying root causes, restoring functionality, and preventing recurrence where possible.Clear communication and documentation ensure that users understand both the issue and the resolution.",
  },
  {
    id: "Documentation",
    title: "Documentation and user guidance",
    icon: "/Service-icons/Documentation.svg",
    content:
      "Clear documentation is an essential part of support. SSI provides user manuals, service instructions, and operational guidance to help laboratories operate instruments correctly and consistently.Well-structured documentation supports training, daily use, and maintenance activities.",
  },
  {
    id: "Training",
    title: "Training and user support",
    icon: "/Service-icons/Training.svg",
    content:
      "SSI offers guidance to help users operate instruments effectively and safely. Training support focuses on proper operation, basic maintenance awareness, and best practices to ensure reliable results.This helps laboratories maintain performance consistency across multiple users",
  },
  {
    id: "Lifecycle",
    title: "Lifecycle support and long-term reliability",
    icon: "/Service-icons/Lifecycle.svg",
    content:
      "Support at SSI extends beyond initial installation. Lifecycle support is designed to help laboratories keep instruments operational, relevant, and dependable over extended periods.This includes service planning, upgrade guidance where applicable, and long-term performance considerations.",
  },
  {
    id: "Commitment",
    title: "Commitment to response and continuity",
    icon: "/Service-icons/Commitment.svg",
    content:
      "SSI is committed to structured support responses and continuity of service. Our goal is to help laboratories maintain workflow stability and protect data integrity, even in demanding operating environments.",
  },
];

export default function ScrollSections() {
  const [activeSection, setActiveSection] = useState("introduction");

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
        {sections.map((section) => (
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
        {sections.map((section) => (
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
