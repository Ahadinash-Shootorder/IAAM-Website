import LazyImage from "@/components/common/LazyImage";
import { AssociationOurRole } from "@/types/association/ourRoleSection";
import { getText } from "@/lib/strapiText";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getOurRoleData(): Promise<AssociationOurRole | null> {
  const res = await fetch(
    `${NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate=AssociationOurRole.image`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data?.[0]?.AssociationOurRole || null;
}

export default async function OurRoleSection() {
  const data = await getOurRoleData();

  // 🛡 Safe guard
  if (!data || !data.image) return null;

  return (
    <SectionContainer bgColor="bg-gray-50">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">

        <div className="md:w-2/5">
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.title}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="md:w-3/5 bg-[hsl(197,63%,22%)] p-6 md:p-8 flex flex-col justify-center">
          <h3 className="font-sans text-xl md:text-2xl text-white font-bold mb-4">
            {data.title}
          </h3>

          <p className="text-white/90 text-sm md:text-base whitespace-pre-line">
            {getText(data.description)}
          </p>
        </div>

      </div>
    </SectionContainer>
  );
}
