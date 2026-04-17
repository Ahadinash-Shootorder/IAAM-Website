
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "12");

  const category = await prisma.category.findUnique({
    where: { slug },
     
  });

  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }

  const skip = (page - 1) * limit;

  const whereClause = { category: category.name };

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

  const response = Response.json({
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
}

