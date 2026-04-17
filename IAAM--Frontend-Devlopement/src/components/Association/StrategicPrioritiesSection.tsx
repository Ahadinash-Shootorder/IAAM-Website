import LazyImage from "@/components/common/LazyImage";
import { StrategicPrioritiesSectionData } from "@/types/association/strategicPriorities";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getStrategicData(): Promise<StrategicPrioritiesSectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationStrategicPriorities][populate][image]=true&populate[AssociationStrategicPriorities][populate][PriorityPoint]=true`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0]?.AssociationStrategicPriorities || null;
}

export default async function StrategicPrioritiesSection() {
  const data = await getStrategicData();
  if (!data) return null;

  return (
    <SectionContainer>
      <div className="grid md:grid-cols-2 gap-8 items-center">

        {/* Image */}
        <div>
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.title}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-auto rounded-sm shadow-lg"
          />
        </div>

        {/* Text */}
        <div>
          <h3 className="font-sans text-2xl text-[hsl(210,20%,20%)] font-bold mb-4">
            {data.title}
          </h3>

          <p className="text-[hsl(210,20%,20%)]/70 mb-4">
            {data.intro}
          </p>

          <ul className="text-[hsl(210,20%,20%)]/70 space-y-2">
            {data.PriorityPoint.map(point => (
              <li key={point.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[hsl(210,20%,20%)] rounded-full mt-2 shrink-0" />
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </SectionContainer>
  );
}
