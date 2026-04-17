"use client";

import ServiceHero from "@/components/Services/ServiceHero";
import ScrollSections from "@/components/Services/ScrollableSection";
import TechnicalAssistance from "@/components/Services/TechnicalAssistance";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceHero />

      <ScrollSections />

      <TechnicalAssistance />
    </div>
  );
}
