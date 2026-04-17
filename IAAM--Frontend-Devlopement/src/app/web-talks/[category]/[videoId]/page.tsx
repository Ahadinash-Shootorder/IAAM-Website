import Link from 'next/link';
import Image from 'next/image';
import { User, Calendar, Clock, Eye } from 'lucide-react';
import Footer from '@/components/FooterNew';
import SecureCloudflareVideo from '@/components/WebTalk/SecureCloudflareVideo';
import Breadcrumb from '@/components/common/Breadcrumb';
import ViewCount from '@/components/ViewCount';

const BASE_URL = "https://admin.iaamonline.org/api";

/* ────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */

interface StrapiVideo {
  id: number;
  Title: string;
  Description: any;
  HostName: string;
  VideoCategory: string;
  VideoID: string;
  createdAt: string;
  Views: number;
}

interface CloudflareVideoResult {
  uid: string;
  thumbnail: string;
  duration: number;
  meta: {
    name: string;
  };
  created: string;
}

/* ────────────────────────────────────────────────────────────────
   Fetch Single Video
──────────────────────────────────────────────────────────────── */

async function getVideoByVideoId(videoId: string) {
  const res = await fetch(
    `${BASE_URL}/vedios?filters[VideoID][$eq]=${videoId}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch video");

  const json = await res.json();
  return json.data[0] as StrapiVideo;
}

/* ────────────────────────────────────────────────────────────────
   Fetch Related Videos
──────────────────────────────────────────────────────────────── */

async function getRelatedVideos(category: string, currentVideoId: string) {
  const res = await fetch(
    `${BASE_URL}/vedios?filters[VideoCategory][$eqi]=${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch related videos");

  const json = await res.json();

  return (json.data as StrapiVideo[]).filter(
    (video) => video.VideoID !== currentVideoId
  );
}

/* ────────────────────────────────────────────────────────────────
   Fetch Cloudflare Video
──────────────────────────────────────────────────────────────── */

async function fetchCloudflareVideo(videoId: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) return null;

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  if (!json.success) return null;

  return json.result as CloudflareVideoResult;
}

/* ────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderDescription(desc: any) {
  if (!desc) return null;

  return desc.map((block: any, index: number) => {
    if (block.type === "paragraph") {
      return (
        <p key={index} className="text-[#333333] text-[16px] sm:text-[18px] leading-relaxed opacity-90">
          {block.children?.map((child: any) => child.text).join("")}
        </p>
      );
    }
    return null;
  });
}

/* ────────────────────────────────────────────────────────────────
   Video Card (Related)
──────────────────────────────────────────────────────────────── */

function VideoCard({
  thumbnail,
  duration,
  title,
  author,
  date,
  category,
  videoId,
}: any) {
  return (
    <Link href={`/web-talks/${encodeURIComponent(category)}/${videoId}`}>
      <div className="bg-white rounded-[10px] shadow-[2.7px_5.4px_25.6px_rgba(0,0,0,0.10)] overflow-hidden ring-[8px] ring-white flex flex-col group cursor-pointer hover:shadow-[2.7px_5.4px_40px_rgba(0,0,0,0.16)] transition-shadow duration-300">

        <div className="relative w-full aspect-[449/269] bg-[#F3F3F3] overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />

          <div className="absolute bottom-[10px] right-[11px] bg-[#202020]/90 rounded-[3px] px-[11px] py-[6px]">
            <span className="text-white text-[14px] tracking-[0.27px]">
              {duration}
            </span>
          </div>
        </div>

        <div className="px-[18px] pt-[10px] pb-[18px] flex flex-col gap-4">
          <h3 className="text-[#1E1E1E] text-[18px] lg:text-[20px] font-bold leading-snug tracking-[0.30px] line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[6px] text-[#333333] text-[14px] opacity-90">
              <User size={18} />
              {author}
            </span>

            <span className="flex items-center gap-[6px] text-[#333333] text-[14px] opacity-90">
              <Calendar size={18} />
              {date}
            </span>
          </div>

          <span className="px-[10px] py-[7px] bg-[rgba(28,62,156,0.05)] rounded-[27px] text-[#1C3E9C] text-[13px] capitalize">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────────────────────────── */

export default async function WebTalksDetailPage(props: {
  params: Promise<{ category: string; videoId: string }>;
}) {
  const { category, videoId } = await props.params;

  const decodedCategory = decodeURIComponent(category);

  const strapiVideo = await getVideoByVideoId(videoId);
  const relatedVideos = await getRelatedVideos(decodedCategory, videoId);
  const cfVideo = await fetchCloudflareVideo(videoId);

  const title = strapiVideo?.Title ?? "Untitled Video";
  const description = strapiVideo?.Description;
  const author = strapiVideo?.HostName ?? "Host";
  const createdAt = formatDate(strapiVideo?.createdAt);
  const duration = cfVideo ? formatDuration(cfVideo.duration) : "—";

  return (
    <>
      <main className="flex-1 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[30px] py-10">

          <div className="lg:pt-8 pt-28 pb-4 translate-x-[-20px]">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Webtalks', href: '/web-talks' },
                { label: decodedCategory },
              ]}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[31px] mb-[80px]">

            <div className="w-full lg:w-[696px]">
              <div className="bg-[#F2F0F0] rounded-[12px] overflow-hidden aspect-video">
                <SecureCloudflareVideo videoId={videoId} />
              </div>
              
            </div>

            <div className="flex-1 flex flex-col gap-[20px]">

              <div className="inline-flex">
                <span className="px-[10px] py-[7px] bg-[rgba(28,62,156,0.05)] rounded-[27px] text-[#1C3E9C] text-[16px] capitalize">
                  {decodedCategory}
                </span>
              </div>

              <h1 className="text-[#1E1E1E] text-[24px] sm:text-[28px] font-bold leading-tight tracking-[0.42px]">
                {title}
              </h1>

              <div className="flex flex-col gap-4 mt-4">
                {renderDescription(description)}
              </div>

              <div className="flex flex-col gap-[15px]">

                <div className="flex items-center gap-[6px]">
                  <User size={20} className="text-[#333333]" />
                  <span className="text-[#333333] text-[16px] sm:text-[18px] opacity-90">
                    {author}
                  </span>
                </div>

                <div className="flex items-center gap-[6px]">
                  <Calendar size={20} className="text-[#333333]" />
                  <span className="text-[#333333] text-[16px] sm:text-[18px] opacity-90">
                    {createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-[6px]">
                  <Clock size={20} className="text-[#333333]" />
                  <span className="text-[#333333] text-[16px] sm:text-[18px] opacity-90">
                    {duration}
                  </span>
                </div>

                <div className="flex items-center gap-[6px]">
                <Eye size={20} className="text-[#333333]" />
                <span className="text-[#333333] text-[16px] sm:text-[18px] opacity-90">
                  <ViewCount
                    videoId={videoId}
                    initialViews={strapiVideo?.Views || 0}
                  />
                </span>
              </div>
              </div>

              {/* DESCRIPTION */}


            </div>
          </div>

          {/* RELATED VIDEOS */}
          <section className="flex flex-col gap-10 pb-[90px]">
            <h2 className="text-[#1E1E1E] text-[22px] sm:text-[28px] font-bold tracking-[0.42px]">
              Related Videos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {await Promise.all(
                relatedVideos.slice(0, 3).map(async (video) => {
                  const cf = await fetchCloudflareVideo(video.VideoID);

                  return (
                    <VideoCard
                      key={video.id}
                      thumbnail={cf?.thumbnail || "/placeholder.jpg"}
                      duration={cf ? formatDuration(cf.duration) : "—"}
                      title={video.Title}
                      author={video.HostName}
                      date={formatDate(video.createdAt)}
                      category={video.VideoCategory}
                      videoId={video.VideoID}
                    />
                  );
                })
              )}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}