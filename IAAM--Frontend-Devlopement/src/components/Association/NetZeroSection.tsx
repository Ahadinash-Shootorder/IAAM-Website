import { NetZeroSectionData } from "@/types/association/netZero";
import SectionContainer from "../common/SectionContainer";

async function getNetZeroData(): Promise<NetZeroSectionData | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate=AssociationNetZero`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data[0]?.AssociationNetZero || null;
}

export default async function NetZeroSection() {
  const data = await getNetZeroData();
  if (!data) return null;

  return (
    <SectionContainer bgColor="bg-gray-50">
      <h2 className="font-sans text-2xl md:text-3xl text-[hsl(210,20%,20%)] font-bold mb-8">
        {data.sectionTitle}
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-[hsl(210,20%,20%)]/70">
            <strong className="text-[hsl(210,20%,20%)]">{data.leftTextBold}</strong>{" "}
            {data.leftText}
          </p>
        </div>

        <div>
          <p className="text-[hsl(210,20%,20%)]/70">
            <strong className="text-[hsl(210,20%,20%)]">{data.rightTextBold}</strong>{" "}
            {data.rightText}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
