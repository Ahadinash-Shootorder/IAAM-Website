import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params; // OLD slug from URL
    const body = await request.json();

    const updatedPage = await prisma.pageContent.update({
      where: { slug: slug },
      data: {
        title: body.title,
        slug: body.slug, // allow slug change
        metaDescription: body.metaDescription,
        content: body.content,
        sections: body.sections,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;

    await prisma.pageContent.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
