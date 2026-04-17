import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_, context) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const parseJsonField = (field) => {
      if (!field) return null;
      if (typeof field === "object") return field;
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    };

    const response = Response.json({
      ...product,
      galleryImages: Array.isArray(product.galleryImages)
        ? product.galleryImages
        : [],
      overviewSections: parseJsonField(product.overviewSections),
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=604800"
    );

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    const updateData = {};

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
        updateData[key] = body[key];
      }
    });

    if (body.price !== undefined && body.price !== null && body.price !== "") {
      updateData.price = parseFloat(body.price);
    }

    if (body.stock !== undefined && body.stock !== null && body.stock !== "") {
      updateData.stock = parseInt(body.stock, 10);
    }

    updateData.galleryImages = Array.isArray(body.galleryImages)
      ? body.galleryImages
      : [];
    updateData.overviewSections =
      typeof body.overviewSections === "string"
        ? body.overviewSections
        : Array.isArray(body.overviewSections)
          ? JSON.stringify(body.overviewSections)
          : "[]";
    updateData.technicalSpecification = body.technicalSpecification || "";
    updateData.application = body.application || "";

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return Response.json({
      ...product,
      galleryImages: Array.isArray(product.galleryImages)
        ? product.galleryImages
        : [],
    });
  } catch (error) {
    console.error("Update error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(_, context) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.delete({
      where: { id },
    });
    return Response.json(product);
  } catch (error) {
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
