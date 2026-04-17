import { NextResponse } from "next/server";

const BASE_URL = "https://admin.iaamonline.org/api";

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/vedios?pagination[pageSize]=100`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ categories: [] });
    }

    const json = await res.json();
    const videos = json.data || [];

    // Extract unique categories
    const categorySet = new Set<string>();

    videos.forEach((video: any) => {
      if (video.VideoCategory) {
        categorySet.add(video.VideoCategory);
      }
    });

    const categories = ["All", ...Array.from(categorySet)];

    return NextResponse.json({ categories });

  } catch (error) {
    return NextResponse.json({ categories: [] });
  }
}