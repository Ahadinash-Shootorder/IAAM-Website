export async function getPage(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=*`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data?.[0] ?? null;
}
