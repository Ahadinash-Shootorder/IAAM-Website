export function getProxiedImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/news-placeholder.jpg';
  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
  
  // Temporarily return direct URLs instead of proxy URLs to debug
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For relative URLs, construct the full Strapi URL directly
  const fullUrl = imageUrl.startsWith('/') 
    ? `${baseUrl}${imageUrl}` 
    : `${baseUrl}/${imageUrl}`;
    
  return fullUrl;
}
