import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
  "https://admin.iaamonline.org";

export default async function HeroSection() {

  const res = await fetch(
    `${STRAPI_BASE_URL}/api/home?populate[HeroBanner][populate]=*`,
    {
      next: { revalidate: 300 }
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  const hero = json?.data?.HeroBanner;
  if (!hero) return null;

  const imageObj = hero?.HeroBanner;

  // 🔥 Use medium format for faster load
  const imagePath =
    imageObj?.formats?.url ||
    imageObj?.url ||
    null;

  const imageUrl = imagePath
    ? `${STRAPI_BASE_URL}${imagePath}`
    : null;

  const dynamicLabel = hero?.HeroBannerButtonLabel;
  const dynamicLink = hero?.HeroBannerButtonLink;

  const staticLabel = "Join or Renew Membership";
  const staticLink = "/iaam-membership";

  const ctaLabel = dynamicLabel || staticLabel;
  const ctaLink = dynamicLink || staticLink;

  return (
    <section className="relative w-full h-[60vh] min-h-[460px] max-h-[600px] bg-black">

      {/* ===== HERO IMAGE ===== */}
      {imageUrl && (
        <LazyImage
          src={imageUrl}
          alt={hero?.HeroBannerTitle || "Hero Banner"}
          fill
          priority
          className="object-cover object-top"
          containerClassName="absolute inset-0"
        />
      )}

      {/* ===== CONTENT ===== */}
      <div className="absolute inset-0 flex items-start justify-start z-10">
        <div className="w-full max-w-7xl px-14 text-white pt-24">

          <h1 className="text-3xl text-black md:text-4xl lg:text-5xl max-w-3xl leading-tight">
            {hero?.HeroBannerTitle}
          </h1>

          {hero?.HeroBannerDescription && (
            <p className="mt-4 text-lg text-black max-w-2xl">
              {hero.HeroBannerDescription}
            </p>
          )}

          <div className="mt-6">
            <Link
              href={ctaLink}
              className="bg-[#1e40af] px-8 py-3 rounded-md font-semibold text-white"
            >
              {ctaLabel}
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}
