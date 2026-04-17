import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = 'https://admin.iaamonline.org';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email || !email.includes('@')) {
    return NextResponse.json({ available: false, error: 'Invalid email' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/users?filters[email][$eqi]=${encodeURIComponent(email.trim())}&fields[0]=email`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ available: true, fallback: true });
    }

    const data = await res.json();
    const exists = Array.isArray(data) ? data.length > 0 : false;

    return NextResponse.json({ available: !exists });
  } catch {
    return NextResponse.json({ available: true, fallback: true });
  }
}