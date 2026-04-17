import { NextResponse } from "next/server";

const BASE_URL = "https://admin.iaamonline.org/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ views: 0 });
  }

  const res = await fetch(
    `${BASE_URL}/vedios?filters[VideoID][$eq]=${videoId}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const video = json.data?.[0];

  return NextResponse.json({
    views: video?.Views || 0,
  });
}