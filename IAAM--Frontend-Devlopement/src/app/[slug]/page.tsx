// import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

import HomeHero from "@/components/Home/HeroSection";
import JoinSection from "@/components/Home/JoinSection";
import EventsSection from "@/components/Home/EventsSection";
import HomeAbout from "@/components/Home/AboutSection";
import BlogSection from "@/components/Home/BlogSection";

import HeroSection from "@/components/HeroComp/HeroSection";
import ContentSection from "@/components/HeroComp/ContentSection";
import Breadcrumb from "@/components/common/Breadcrumb";
import FooterNew from "@/components/FooterNew";

import { getTopContentBySlug } from "@/lib/api";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Block events and web-talks
  if (slug === "events" || slug === "web-talks") notFound();

  // Home
  if (slug === "home" || slug === "") {
    return (
      <div className="min-h-screen bg-white">
        <main>
          <HomeHero />
          <HomeAbout />
          <JoinSection />
          <EventsSection />
          <BlogSection />
        </main>
        {/* <Footer /> */}
        <FooterNew />
      </div>
    );
  }

  const data = await getTopContentBySlug(slug);

  if (!data) notFound();

  return (
    <div className="bg-white min-h-screen">

      <div className="relative">
        <HeroSection data={data} />

        <div className="relative bg-white z-20">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: data.PageTitle || slug },
            ]}
          />
        </div>

        <ContentSection sections={data.Section} />
      </div>

      {/* <Footer /> */}
      <FooterNew />
    </div>
  );
}