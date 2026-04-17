const BASE_URL = "https://admin.iaamonline.org/api";

/* ===============================
   GET ALL VIDEOS (Paginated)
================================= */
export async function getAllVideos(page = 1, pageSize = 9) {
  const res = await fetch(
    `${BASE_URL}/vedios?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }

  return res.json();
}

/* ===============================
   GET SINGLE VIDEO (By VideoID)
================================= */
export async function getSingleVideo(videoId: string) {
  const res = await fetch(
    `${BASE_URL}/vedios?filters[VideoID][$eq]=${videoId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch single video");
  }

  return res.json();
}

export function getThumbnail(videoId: string) {
  const subdomain =
    process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN;

  return `https://${subdomain}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
}

export async function getFeaturedVideos(page: number) {
  const res = await fetch(
    `${BASE_URL}/vedios?filters[FeaturedVideo][$eq]=true&filters[DisplayRole][$eq]=Public&pagination[page]=${page}&pagination[pageSize]=6&sort=createdAt:desc`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch featured videos");
  return res.json();
}

export async function getVideosByCategory(category: string, page: number) {
  const res = await fetch(
    `${BASE_URL}/vedios?pagination[pageSize]=100&sort=createdAt:desc`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch videos");

  const data = await res.json();
  let filtered = data.data;

  if (category !== "All") {
    filtered = filtered.filter(
      (video: any) =>
        video.VideoCategory?.toLowerCase() === category.toLowerCase()
    );
  }

  const pageSize = 9;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    data: paginated,
    meta: {
      pagination: {
        pageCount: Math.ceil(filtered.length / pageSize),
      },
    },
  };
}

export async function getAllCategories(): Promise<string[]> {
  const res = await fetch(
    `${BASE_URL}/vedios?pagination[pageSize]=100`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();

  const categories: string[] = Array.from(
    new Set(data.data.map((item: any) => item.VideoCategory))
  );

  return ["All", ...categories];
}