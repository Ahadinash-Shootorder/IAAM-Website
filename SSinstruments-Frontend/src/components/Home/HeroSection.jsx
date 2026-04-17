"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import HeroBannerDisplay from "@/components/HeroBannerDisplay";

export default function HeroSlider({ section }) {
  console.log(section);

  return <HeroBannerDisplay data={section?.data} />;
}
