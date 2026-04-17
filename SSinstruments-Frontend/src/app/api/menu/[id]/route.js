import { prisma } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { order, label, type, target , parentId } = await request.json();

    const updateData = {};
    if (order !== undefined) updateData.order = order;
    if (label) updateData.label = label;
    if (type) updateData.type = type;
    if (target) updateData.target = target;
    if (parentId !== undefined) updateData.parentId = parentId;

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    return Response.json(updatedItem);
  } catch (error) {
    return Response.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.menuItem.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete menu item" },
      { status: 500 },
    );
  }
}
