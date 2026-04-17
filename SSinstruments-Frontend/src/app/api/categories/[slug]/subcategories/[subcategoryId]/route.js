import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { subcategoryId } = await params;
    const subcategory = await prisma.subCategory.findUnique({
      where: { id: subcategoryId },
    });
    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategory" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { subcategoryId } = await params;
    const body = await request.json();
    const subcategory = await prisma.subCategory.update({
      where: { id: subcategoryId },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        icon: body.icon || null,
      },
    });
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { subcategoryId } = await params;
    await prisma.subCategory.delete({
      where: { id: subcategoryId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
