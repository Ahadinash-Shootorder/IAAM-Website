import { NextResponse } from "next/server";

const BASE_URL = "https://admin.iaamonline.org/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ data: [] });
    }

    const encodedQuery = encodeURIComponent(query.trim());

    const url =
      `${BASE_URL}/vedios?` +
      `filters[$or][0][Title][$containsi]=${encodedQuery}&` +
      `filters[$or][1][HostName][$containsi]=${encodedQuery}&` +
      `filters[$or][2][VideoCategory][$containsi]=${encodedQuery}&` +
      `pagination[pageSize]=10`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const json = await res.json();

    return NextResponse.json({
      data: json.data || [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: [] });
  }
}