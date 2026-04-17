import LazyImage from "@/components/common/LazyImage";
import { VisionMissionData } from "@/types/association/visionMissionSection";
import SectionContainer from "../common/SectionContainer";

const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getVisionMission(): Promise<VisionMissionData | null> {
  const res = await fetch(
    `${NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate=AssociationVisionMission.MissionPoint`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json?.data?.[0]?.AssociationVisionMission ?? null;
}

export default async function VisionMissionSection() {
  const data = await getVisionMission();

  if (!data) return null;

  return (
    <SectionContainer>
      <h2 className="font-sans text-2xl md:text-3xl text-[hsl(210,20%,20%)] font-bold mb-2">
        {data.sectionTitle}
      </h2>

      <p className="text-[hsl(210,20%,20%)]/70 mb-8">
        {data.sectionSubtitle}
      </p>

      <div className="grid md:grid-cols-2 gap-8 rounded-sm overflow-hidden shadow-sm w-full">
        {/* Vision */}
        <div className="bg-[hsl(197,63%,22%)] p-6 md:p-8">
          <h3 className="font-sans text-xl text-white font-bold mb-4">
            {data.visionTitle}
          </h3>

          <p className="text-white/90">
            {data.visionDescription?.[0]?.children?.[0]?.text}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-[hsl(197,63%,22%)] p-6 md:p-8">
          <h3 className="font-sans text-xl text-white font-bold mb-4">
            {data.missionTitle}
          </h3>

          <p className="text-white/90 mb-3">{data.missionIntro}</p>

          <ul className="text-white/90 space-y-2">
            {data.MissionPoint.map((point) => (
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
