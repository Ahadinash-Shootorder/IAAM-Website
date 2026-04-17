import LazyImage from "@/components/common/LazyImage";
import { AssociationHeroData } from "@/types/association/heroSection";
import { getProxiedImageUrl } from "@/lib/imageProxy";

const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function HeroSection() {
  const response = await fetch(
    `${NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationHero][populate]=backgroundImage`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch association hero");
  }

  const data = await response.json();
  const hero: AssociationHeroData = data.data?.[0]?.AssociationHero;

  if (!hero) return null;

  const imageUrl = hero.backgroundImage?.url
    ? getProxiedImageUrl(hero.backgroundImage.url)
    : "/Association_Banner.jpg";

  return (
    <section className="relative h-[400px] md:h-[500px]">
      <div className="absolute inset-0">
        <LazyImage
          src={imageUrl}
          alt={hero.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center max-w-6xl">
        <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl text-white mb-4 max-w-2xl leading-tight">
          {hero.title}
        </h1>

        <p className="text-white/90 text-base md:text-lg max-w-xl mb-6">
          {hero.subtitle}
        </p>

        <a
          href={hero.buttonLink}
          className="bg-[hsl(197,63%,22%)] font-bold hover:bg-white hover:text-[hsl(197,63%,22%)] text-white px-6 py-3 rounded-sm w-fit transition-colors"
        >
          {hero.buttonText}
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
