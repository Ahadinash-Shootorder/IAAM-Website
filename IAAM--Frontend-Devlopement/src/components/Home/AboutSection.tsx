import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";
import { getAboutData } from "@/lib/api";

export default async function AboutSection() {
  const about = await getAboutData();

  if (!about) {
    return (
      <section className="py-24 text-center text-red-500">
        Failed to load about section
      </section>
    );
  }

  const descriptionText =
    about.Description?.map((block: any) =>
      block.children.map((child: any) => child.text).join("")
    ).join(" ") || "";

  const imageUrl =
    about?.Image?.formats?.large?.url
      ? getProxiedImageUrl(about.Image.formats.large.url)
      : about?.Image?.url
      ? getProxiedImageUrl(about.Image.url)
      : "/global_impact.jpg"; // Use existing image as fallback

  return (
    <SectionContainer>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

        <div className="order-last md:order-first">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
            {about.Heading}
          </h2>

          <p className="text-slate-700 mb-8">
            {descriptionText}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {about.Cards?.map((card: any) => (
              <div
                key={card.id}
                className="p-4 bg-gray-200 rounded"
              >
                <h4 className="font-bold text-slate-800 mb-2">
                  {card.Heading}
                </h4>
                <p className="text-sm text-slate-700">
                  {card.Description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="#"
            className="block text-center bg-[#1e40af] text-white px-6 py-3 font-semibold rounded hover:bg-[#152f8c] transition"
          >
            Learn More
          </Link>
        </div>

        <div className="order-first md:order-last relative h-[516px] w-full">
          <LazyImage
            src={imageUrl}
            alt={about.Image?.alternativeText || "About Image"}
            className="w-full h-full object-cover rounded shadow-lg"
            fill
          />
        </div>

      </div>
    </SectionContainer>
  );
}
