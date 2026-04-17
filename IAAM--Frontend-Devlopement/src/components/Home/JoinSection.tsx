import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";
import SectionContainer from "../common/SectionContainer";
import { JoinSectionData } from "@/types/home/joinSection";
import { getProxiedImageUrl } from "@/lib/imageProxy";

const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Cache for JoinSection data
let joinSectionCache: JoinSectionData | null = null;
let joinCacheTime = 0;
const JOIN_CACHE_DURATION = 300000; // 5 minutes

async function getJoinSectionData(): Promise<JoinSectionData | null> {
  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (joinSectionCache && (now - joinCacheTime) < JOIN_CACHE_DURATION) {
      return joinSectionCache;
    }

    const baseUrl = NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
    const strapiUrl = new URL(`${baseUrl}/api/home`)

    strapiUrl.searchParams.append("populate[SecondFold][populate][FirstCard][populate]", "*")
    strapiUrl.searchParams.append("populate[SecondFold][populate][SecondCard][populate]", "Image")
    strapiUrl.searchParams.append("populate[SecondFold][populate][ThirdCards][populate]", "*")

    const res = await fetch(strapiUrl.toString(), {
      cache: "force-cache",
      next: { revalidate: 300 },
    })

    if (!res.ok) throw new Error("JoinSection fetch failed")

    const json = await res.json()
    const data = json?.data?.SecondFold as JoinSectionData;
    
    // Update cache
    joinSectionCache = data;
    joinCacheTime = now;
    
    return data;
  } catch (error) {
    console.error("JoinSection error:", error)
    return joinSectionCache || null;
  }
}


export default async function JoinSection() {
  const data = await getJoinSectionData();
  if (!data) return null;

  const { SectionTitle, FirstCard, SecondCard, ThirdCards } = data;

  const imageUrl = SecondCard?.Image?.formats?.large?.url
      ? getProxiedImageUrl(SecondCard.Image.formats.large.url)
      : SecondCard?.Image?.url
      ? getProxiedImageUrl(SecondCard.Image.url)
      : "/speaker-discussion.png";

  return (
    <SectionContainer>
      {/* ===== TITLE ===== */}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">
        {SectionTitle}
      </h2>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">

        {/* ========== LEFT BIG CARD (FirstCard) ========== */}
        <div className="lg:col-span-4">
          <div className="h-full bg-[#1e40af] text-white p-4 flex flex-col justify-between rounded-sm">
            <div>
              <h3 className="text-3xl font-bold mb-4 pl-4">
                {FirstCard?.Cardtitle}
              </h3>

              <p className="text-white/90 pl-4">
                {FirstCard?.CardDescription}
              </p>
            </div>

            <Link
              href={FirstCard?.CardButtonLink || "#"}
              className="mt-8 inline-block border-2 border-white text-center py-4 px-6 font-semibold hover:bg-white hover:text-[hsl(197,63%,22%)] transition rounded-xl"
            >
              {FirstCard?.CardButtonLabel}
            </Link>
          </div>
        </div>

        {/* ========== CENTER IMAGE ========== */}
        <div className="lg:col-span-3 hidden lg:block relative">
          <LazyImage
            src={imageUrl || "/speaker-discussion.png"}
            alt="IAAM Community"
            className="w-full h-full object-cover rounded-sm"
            fill
          />
        </div>

        {/* ========== RIGHT 4 CARDS (ThirdCards) ========== */}
        <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4 auto-rows-fr">
          {ThirdCards?.map((card: any, index: number) => {
            const isDark = index < 2;

            return (
              <div
                key={card.id}
                className={`p-6 rounded-sm ${
                  isDark
                    ? "bg-[#1e40af] text-white"
                    : "bg-[hsl(197,30%,95%)]"
                }`}
              >
                <h4
                  className={`font-bold mb-3 ${
                    isDark
                      ? "text-white"
                      : "text-[#1e40af]"
                  }`}
                >
                  {card.Heading}
                </h4>

                <p
                  className={`text-sm ${
                    isDark
                      ? "text-white/90"
                      : "text-gray-700"
                  }`}
                >
                  {card.Description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </SectionContainer>
  );
}
