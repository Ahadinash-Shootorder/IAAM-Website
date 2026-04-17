import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });
    return Response.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return Response.json(setting, { status: 201 });
  } catch (error) {
    console.error('Error saving setting:', error);
    return Response.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    );
  }
}
