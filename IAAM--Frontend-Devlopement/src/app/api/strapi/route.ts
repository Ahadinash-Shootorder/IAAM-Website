export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'home';
  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://localhost';
  const strapiUrl = new URL(`${baseUrl}/api/${endpoint}`);
  
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') {
      strapiUrl.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(strapiUrl.toString());
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch from Strapi' }, { status: 500 });
  }
}
