import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { subcategoryId } = await params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;
    const whereClause = { subcategoryId };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          featureImage: true,
        },
        skip,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      page === 1 ? prisma.product.count({ where: whereClause }) : Promise.resolve(null),
    ]);

    const totalCount = total !== null ? total : (page - 1) * limit + products.length;

    const response = NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: totalCount ? Math.ceil(totalCount / limit) : 1,
      },
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Error fetching subcategory products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
