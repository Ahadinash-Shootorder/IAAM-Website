import LazyImage from "@/components/common/LazyImage";
import { ContactSectionData } from "@/types/association/contact";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

async function getContactSection(): Promise<ContactSectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate[AssociationContact][populate][image]=true`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0]?.AssociationContact || null;
}

export default async function ContactSection() {
  const data = await getContactSection();
  if (!data) return null;

  function renderRichText(blocks: any[]) {
    return blocks.map((block, i) =>
      block.children.map((child: any, j: number) => (
        <span key={`${i}-${j}`}>{child.text}</span>
      ))
    );
  }

  return (
    <SectionContainer bgColor="bg-gray-50">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-sm shadow-sm">
        <div className="md:w-1/2 bg-[hsl(197,63%,22%)] p-8 md:p-10 flex flex-col justify-center">
          <h3 className="font-sans text-xl md:text-2xl text-white font-bold mb-4 leading-snug">
            {data.headline}
          </h3>

          <h4 className="font-sans text-lg text-white font-bold mb-3">
            {data.subTitle}
          </h4>

          <p className="text-white/90 text-sm">
            {renderRichText(data.description)}
          </p>
        </div>

        <div className="md:w-1/2">
          <LazyImage
            src={getProxiedImageUrl(data.image.url)}
            alt={data.subTitle}
            width={data.image.width}
            height={data.image.height}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
