import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { use } from "react";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { key } = await params;
    const section = await prisma.homeSection.findUnique({
      where: { sectionKey: key },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { key } = await params;
    const data = await request.json();

    const section = await prisma.homeSection.update({
      where: { sectionKey: key },
      data,
    });

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { key } = await params;

    await prisma.homeSection.delete({
      where: { sectionKey: key },
    });

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
