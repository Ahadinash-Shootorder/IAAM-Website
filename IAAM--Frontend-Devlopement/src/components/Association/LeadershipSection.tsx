import LazyImage from "@/components/common/LazyImage";
import { LeadershipSectionData } from "@/types/association/leadershipSection";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getLeadershipData(): Promise<LeadershipSectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationLeadership][populate][image]=true&populate[AssociationLeadership][populate][LeadershipPoint]=true`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data?.[0]?.AssociationLeadership ?? null;
}

export default async function LeadershipSection() {
  const data = await getLeadershipData();
  if (!data) return null;

  const image = data.image;

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">
        
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="font-sans text-xl md:text-2xl text-[hsl(210,20%,20%)] font-bold mb-4">
            {data.title}
          </h3>

          <p className="text-[hsl(210,20%,20%)]/70 mb-4">
            {data.description?.[0]?.children?.[0]?.text}
          </p>

          <ul className="text-[hsl(210,20%,20%)]/70 space-y-2">
            {data.LeadershipPoint.map(point => (
              <li key={point.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[hsl(210,20%,20%)] rounded-full mt-2 shrink-0" />
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-2/5">
          <LazyImage
            src={getProxiedImageUrl(image.url)}
            alt={data.title}
            width={image.width}
            height={image.height}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
