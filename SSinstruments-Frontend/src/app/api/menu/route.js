import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
    });

    const response = NextResponse.json(menuItems);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return response;
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch menu items" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { label, type, target, parentId } = await request.json();

    if (!label || !type || !target) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const lastItem = await prisma.menuItem.findFirst({
      orderBy: { order: "desc" },
    });

    const newItem = await prisma.menuItem.create({
      data: {
        label,
        type,
        target,
        parentId: parentId || null,
        order: (lastItem?.order || 0) + 1,
      },
    });

    return Response.json(newItem, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
  }
}
