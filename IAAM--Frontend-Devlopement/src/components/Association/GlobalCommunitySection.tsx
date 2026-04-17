import LazyImage from "@/components/common/LazyImage";
import { GlobalCommunitySectionData } from "@/types/association/globalCommunity";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getGlobalCommunity(): Promise<GlobalCommunitySectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationGlobalCommunity][populate][image]=true&populate[AssociationGlobalCommunity][populate][CommunityPoint]=true`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0]?.AssociationGlobalCommunity || null;
}

export default async function GlobalCommunitySection() {
  const data = await getGlobalCommunity();
  if (!data) return null;

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">
        <div className="md:w-2/5">
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.title}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="font-sans text-xl md:text-2xl text-[hsl(210,20%,20%)] font-bold mb-4">
            {data.title}
          </h3>

          <p className="text-[hsl(210,20%,20%)]/70 mb-4">
            {data.intro}
          </p>

          <ul className="text-[hsl(210,20%,20%)]/70 space-y-2">
            {data.CommunityPoint.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[hsl(210,20%,20%)] rounded-full mt-2 shrink-0" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="text-[hsl(210,20%,20%)]/70 mt-4">
            {data.closingText}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
