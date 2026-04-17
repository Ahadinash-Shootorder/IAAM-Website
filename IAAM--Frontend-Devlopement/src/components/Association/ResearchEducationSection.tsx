import LazyImage from "@/components/common/LazyImage";
import { ResearchEducationSectionData } from "@/types/association/researchEducation";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getResearchEducationData(): Promise<ResearchEducationSectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationResearchEducation][populate][image]=true&populate[AssociationResearchEducation][populate][ResearchPoint]=true`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0]?.AssociationResearchEducation || null;
}

export default async function ResearchEducationSection() {
  const data = await getResearchEducationData();

  if (!data) return null;

  return (
    <SectionContainer bgColor="bg-gray-50">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">

        {/* Text */}
        <div className="md:w-3/5 bg-[hsl(197,63%,22%)] p-6 md:p-8 flex flex-col justify-center">
          <h3 className="font-sans text-xl md:text-2xl text-white font-bold mb-4">
            {data.title}
          </h3>

          <p className="text-white/90 mb-4">
            {data.intro}
          </p>

          <ul className="text-white/90 space-y-2 text-sm">
            {data.ResearchPoint.map(point => (
              <li key={point.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 shrink-0" />
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image */}
        <div className="md:w-2/5">
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.title}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </SectionContainer>
  );
}
