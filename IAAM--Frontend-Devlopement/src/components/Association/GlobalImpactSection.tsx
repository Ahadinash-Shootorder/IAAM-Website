import LazyImage from "@/components/common/LazyImage";
import { AssociationGlobalImpact } from "@/types/association/globalImpactSection";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getGlobalImpact(): Promise<AssociationGlobalImpact> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate=AssociationGlobalImpact.ImpactPoint&populate=AssociationGlobalImpact.image`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0].AssociationGlobalImpact;
}

export default async function GlobalImpactSection() {
  const data = await getGlobalImpact();

  return (
    <SectionContainer bgColor="bg-gray-50">
      <h2 className="font-sans text-2xl md:text-3xl text-[hsl(210,20%,20%)] font-bold mb-2">
        {data.sectionTitle}
      </h2>

      <p className="text-[hsl(210,20%,20%)]/70 mb-8">
        {data.sectionSubtitle}
      </p>

      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">
        <div className="md:w-2/5">
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.impactTitle}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-3/5 bg-[hsl(197,63%,22%)] p-6 md:p-8 flex flex-col justify-center">
          <h3 className="font-sans text-xl text-white font-bold mb-3">
            {data.impactTitle}
          </h3>

          <p className="text-white/90 mb-4 text-sm">
            {data.impactIntro}
          </p>

          <ul className="text-white/90 space-y-2 text-sm">
            {data.ImpactPoint.map(point => (
              <li key={point.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 shrink-0" />
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
