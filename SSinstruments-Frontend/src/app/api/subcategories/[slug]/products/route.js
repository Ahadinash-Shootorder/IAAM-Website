import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const subcategory = await prisma.subCategory.findFirst({
      where: { slug },
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        category: subcategory.id,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching subcategory products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
