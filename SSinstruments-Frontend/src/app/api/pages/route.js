import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    const response = NextResponse.json(pages);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    return response;
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
