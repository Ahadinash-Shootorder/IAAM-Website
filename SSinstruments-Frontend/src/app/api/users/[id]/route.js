import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { email, name, role, password } = body;

    const data = { email, name, role };
    if (password) {
      data.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
