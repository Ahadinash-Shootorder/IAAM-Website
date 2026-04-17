import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        subcategoryId: true,
        stock: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        featureImage: true,
      },
    });

    // Handle null prices by converting them to 0
    const productsWithValidPrices = products.map((product) => ({
      ...product,
      price: 0,
    }));

    const response = NextResponse.json(
      Array.isArray(productsWithValidPrices) ? productsWithValidPrices : [],
    );
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return response;
  } catch (error) {
    console.error("Fetch products error:", error.message || error);
    console.error("Full error:", error);
    return Response.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const createData = {};

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
        createData[key] = body[key];
      }
    });

    if (body.price !== undefined && body.price !== null && body.price !== "") {
      createData.price = parseFloat(body.price);
    }

    if (body.stock !== undefined && body.stock !== null && body.stock !== "") {
      createData.stock = parseInt(body.stock, 10);
    }

    createData.galleryImages = Array.isArray(body.galleryImages)
      ? body.galleryImages
      : [];
    if (body.overviewSections) {
      createData.overviewSections =
        typeof body.overviewSections === "string"
          ? body.overviewSections
          : JSON.stringify(body.overviewSections);
    }
    createData.technicalSpecification = body.technicalSpecification || "";
    createData.application = body.application || "";

    const newProduct = await prisma.product.create({
      data: createData,
    });
    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { error: error.message || "Failed to create product" },
      { status: 500 },
    );
  }
}
