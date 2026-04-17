"use client";
import HeroSlider from "@/components/Home/HeroSection";
import HomeCardSection from "@/components/Home/HeroCardSection";
import NewReleaseSection from "@/components/Home/NewReleaseSection";
import FeaturedProductsSection from "@/components/Home/FeaturedProductSection";
import SecondFeaturedSection from "@/components/Home/SecondFeaturedSection";
import ApplicationAreaSection from "@/components/Home/ApplicationAreaSection";
import HomeBlogSection from "@/components/Home/HomeBlogSection";
import WhySSISection from "@/components/Home/WhySSISection";
import LongTermValueSection from "@/components/Home/LongTermValue";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, sectionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/home-sections"),
        ]);
        const productsData = await productsRes.json();
        const sectionsData = await sectionsRes.json();
        setProducts(productsData);
        const sectionsMap = {};
        sectionsData.forEach((section) => {
          sectionsMap[section.sectionKey] = section;
        });
        setSections(sectionsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSlider section={sections.hero_banner} />

      <HomeCardSection section={sections.features} />

      <NewReleaseSection section={sections.new_releases} />

      <FeaturedProductsSection section={sections.featured_products} />

      <SecondFeaturedSection section={sections.second_featured} />

      <ApplicationAreaSection section={sections.application_areas} />

      <WhySSISection />

      <LongTermValueSection />

      <HomeBlogSection section={sections.blog} />
    </div>
  );
}
