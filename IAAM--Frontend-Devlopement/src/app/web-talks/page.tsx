import Link from "next/link";
import Image from "next/image";
import { User, Calendar, Eye } from "lucide-react";
import Footer from "@/components/FooterNew";
import Breadcrumb from "@/components/common/Breadcrumb";
import { getThumbnail, getFeaturedVideos, getVideosByCategory, getAllCategories } from "@/lib/vedio-api";


/* ===============================
   Video Card
================================= */
function VideoCard({ video }: any) {
  return (
    <Link
      href={`/web-talks/${encodeURIComponent(
        video.VideoCategory
      )}/${video.VideoID}`}
    >
      <div className="bg-white rounded-[10px] shadow-[2.7px_5.4px_25.6px_rgba(0,0,0,0.10)] overflow-hidden ring-[8px] ring-white flex flex-col group cursor-pointer hover:shadow-[2.7px_5.4px_40px_rgba(0,0,0,0.16)] transition-shadow duration-300">

        <div className="relative w-full aspect-[449/269] bg-[#F3F3F3] overflow-hidden flex-shrink-0">
          <Image
            src={getThumbnail(video.VideoID)}
            alt={video.Title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>

        <div className="px-[18px] pt-[10px] pb-[18px] flex flex-col gap-4 flex-1">
          <h3 className="text-[#1E1E1E] text-[18px] lg:text-[20px] font-bold leading-snug tracking-[0.30px] line-clamp-2 min-h-[50px]">
            {video.Title}
          </h3>

          <div className="flex flex-col gap-[18px] mt-auto">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-[6px] text-[#333333] text-[14px] lg:text-[16px] capitalize tracking-[0.24px] opacity-90">
                <User size={18} strokeWidth={2} />
                {video.HostName}
              </span>
              <span className="flex items-center gap-[6px] text-[#333333] text-[14px] lg:text-[16px] capitalize tracking-[0.24px] opacity-90">
                <Calendar size={18} strokeWidth={2.25} />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-[6px] text-[#333333] text-[14px] lg:text-[16px] capitalize tracking-[0.24px] opacity-90">
                <Eye size={18} strokeWidth={2.25} />
                {video.Views || 0} Views
              </span>
              <span className="px-[10px] py-[7px] bg-[rgba(28,62,156,0.05)] rounded-[27px] text-[#1C3E9C] text-[13px] lg:text-[16px] capitalize tracking-[0.24px] opacity-90 whitespace-nowrap">
                {video.VideoCategory}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ===============================
   PAGE
================================= */
export default async function WebTalksPage(props: {
  searchParams: Promise<{
    page?: string;
    featuredPage?: string;
    category?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page || 1);
  const featuredPage = Number(searchParams?.featuredPage || 1);
  const category = searchParams?.category || "All";

  const featuredRes = await getFeaturedVideos(featuredPage);
  const categoryRes = await getVideosByCategory(category, page);
  const categories: string[] = await getAllCategories();

  const featuredVideos = featuredRes.data || [];
  const featuredTotalPages =
    featuredRes.meta?.pagination?.pageCount || 1;

  const categoryVideos = categoryRes.data || [];
  const categoryTotalPages =
    categoryRes.meta?.pagination?.pageCount || 1;

  return (
    <>
      <main className="flex-1 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[30px] py-10 flex flex-col">

          <div className="pt-28 lg:pt-8 lg:translate-x-[-2.5%]">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Webtalks" },
              ]}
            />
          </div>

          {/* FEATURED */}
          <section className="flex flex-col gap-10">
            <h2 className="text-[#1E1E1E] text-[22px] sm:text-[28px] font-bold tracking-[0.42px]">
              Featured Videos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video: any) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Featured Pagination */}
            <div className="flex justify-center pt-4 gap-2">
              {Array.from({ length: featuredTotalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/web-talks?featuredPage=${i + 1}&category=${category}&page=${page}`}
                  className={`w-[34px] h-[32px] rounded-[8px] text-[16px] flex items-center justify-center ${
                    featuredPage === i + 1
                      ? "bg-[#2C2C2C] text-[#F5F5F5]"
                      : "text-[#1E1E1E] hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </section>

          {/* BROWSE BY CATEGORY */}
          <section className="flex flex-col gap-10 pb-[90px] pt-16">
            <h2 className="text-[#1E1E1E] text-[22px] sm:text-[28px] font-bold tracking-[0.42px]">
              Browse by Category
            </h2>

            <div className="flex flex-wrap gap-[10px] sm:gap-[11px]">
              {categories.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/web-talks?category=${encodeURIComponent(
                    cat
                  )}&page=1&featuredPage=${featuredPage}`}
                  className={`px-[15px] py-[7px] sm:py-[10px] rounded-[27px] text-[15px] sm:text-[18px] capitalize tracking-[0.27px] ${
                    category === cat
                      ? "bg-[#1C3E9C] text-white"
                      : "bg-[rgba(28,62,156,0.05)] text-[#1C3E9C] hover:bg-[rgba(28,62,156,0.12)]"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryVideos.map((video: any) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Category Pagination */}
            <div className="flex justify-center pt-4 gap-2">
              {Array.from({ length: categoryTotalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/web-talks?category=${category}&page=${
                    i + 1
                  }&featuredPage=${featuredPage}`}
                  className={`w-[34px] h-[32px] rounded-[8px] text-[16px] flex items-center justify-center ${
                    page === i + 1
                      ? "bg-[#2C2C2C] text-[#F5F5F5]"
                      : "text-[#1E1E1E] hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}