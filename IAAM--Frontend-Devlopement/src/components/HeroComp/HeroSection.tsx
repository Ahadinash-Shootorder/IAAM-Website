const API = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://admin.iaamonline.org";

import LazyImage from "@/components/common/LazyImage";

type Props = {
  data: any;
};

export default function HeroSection({ data }: Props) {
  const hero = data?.HeroBanner;

  // Fallback data when Strapi data is not available
  const fallbackData = {
    pageTitle: "Welcome to IAAM",
    heroTitle: "Advancing Materials Science for a Sustainable Future",
    heroDescription: "Join the global community of researchers, scientists, and innovators working together to shape tomorrow's world through advanced materials research and innovation.",
    buttonLabel: "Join IAAM Today",
    buttonLink: "/iaam-membership",
    fallbackImage: true
  };

  const pageTitle = data?.PageTitle || fallbackData.pageTitle;
  const heroTitle = hero?.HeroBannerTitle || fallbackData.heroTitle;
  const heroDescription = hero?.HeroBannerDescription || fallbackData.heroDescription;
  const buttonLabel = hero?.HeroBannerButtonLabel || fallbackData.buttonLabel;
  const buttonLink = hero?.HeroBannerButtonLink || fallbackData.buttonLink;
  const isFallback = !hero || !hero?.HeroBanner;

  const imageUrl = hero?.HeroBanner?.url ? `${API}${hero.HeroBanner.url}` : "/hero-conference.png";

  return (
  <section className="relative w-full h-[60vh] min-h-[460px] max-h-[600px] bg-black">

  {/* IMAGE */}
  {imageUrl && (
    <LazyImage
      src={imageUrl}
      alt={pageTitle || "Hero"}
      fill
      className="object-cover object-top"
      containerClassName="absolute inset-0"
      priority
    />
  )}

  {/* Fallback black overlay if no image */}
  {isFallback && (
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        {/* <div className="text-6xl font-bold mb-4">🔬</div> */}
        <p className="text-3xl opacity-75">1280 × 460</p>
      </div>
    </div>
  )}

  {/* CONTENT */}
  <div className="absolute inset-0 flex items-start justify-start z-10">
    <div className="w-full max-w-7xl px-6 text-white pt-24">
      
      <span className="text-sm text-black uppercase tracking-wider mb-3 block">
        {pageTitle}
      </span>

      <h1 className="text-3xl text-black md:text-4xl lg:text-5xl max-w-3xl leading-tight">
        {heroTitle}
      </h1>

      {heroDescription && (
        <p className="mt-4 text-lg text-black max-w-2xl">
          {heroDescription}
        </p>
      )}

      <div className="mt-6">
        <a
          href={buttonLink}
          className="bg-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          {buttonLabel}
        </a>
      </div>

    </div>
  </div>
</section>
  );
}
