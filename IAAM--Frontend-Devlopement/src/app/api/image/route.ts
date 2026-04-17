export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      return new Response('Image not found', { status: 404 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch image', { status: 500 });
  }
}
