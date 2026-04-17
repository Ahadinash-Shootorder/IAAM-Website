import LazyImage from "@/components/common/LazyImage";
import { AssociationAboutData } from "@/types/association/aboutSection";

const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

function extractText(blocks: any[]) {
  return blocks
    ?.map((block) => block.children.map((c: any) => c.text).join(""))
    .join("\n");
}


const SectionContainer = ({ children, className = "", bgColor = "bg-white" }: { children: React.ReactNode; className?: string; bgColor?: string }) => (
  <section className={`py-16 ${bgColor} ${className}`}>
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  </section>
);

async function AboutSection() {
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_STRAPI_URL}/api/association-pages?populate=AssociationAbout`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("Failed to fetch association about section");

    const json = await res.json();
    const about: AssociationAboutData =
      json.data?.[0]?.AssociationAbout;

    if (!about) return null;

    return (
      <SectionContainer>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT — TEXT */}
          <div>
            <h2 className="font-sans text-2xl md:text-3xl text-[hsl(210,20%,20%)] font-bold mb-6 leading-tight">
              {about.title}
            </h2>

            <p className="text-[hsl(210,20%,20%)]/70 mb-4">
              {extractText(about.paragraph1)}
            </p>

            <p className="text-[hsl(210,20%,20%)]/70">
              {extractText(about.paragraph2)}
            </p>
          </div>

          {/* RIGHT — IMAGE */}
          <div>
            <LazyImage
              src="/Association_2_img.jpg"
              alt="IAAM Conference Auditorium"
              width={600}
              height={400}
              className="w-full h-auto rounded-sm shadow-lg"
            />
          </div>

        </div>
      </SectionContainer>
    );
  } catch (error) {
    console.error("AssociationAboutSection:", error);
    return null;
  }
}

export default AboutSection;
