import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = 'https://admin.iaamonline.org';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username || username.trim().length < 3) {
    return NextResponse.json({ available: false, error: 'Username too short' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/users?filters[username][$eqi]=${encodeURIComponent(username.trim())}&fields[0]=username`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      // If Strapi returns error (e.g. no token), fall back gracefully
      return NextResponse.json({ available: true, fallback: true });
    }

    const data = await res.json();
    const exists = Array.isArray(data) ? data.length > 0 : false;

    return NextResponse.json({ available: !exists });
  } catch {
    // Network error — don't block the user, let Strapi handle it on submit
    return NextResponse.json({ available: true, fallback: true });
  }
}