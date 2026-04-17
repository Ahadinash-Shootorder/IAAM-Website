import { notFound } from "next/navigation";
import { getTopContentBySlug } from "@/lib/api";
import HeroSection from "@/components/HeroComp/HeroSection";
import ContentSection from "@/components/HeroComp/ContentSection";
import Footer from "@/components/FooterNew";
import Breadcrumb from "@/components/common/Breadcrumb";

interface Props {
  slug: string;
}

export default async function DynamicCategoryPage({ slug }: Props) {
  const page = await getTopContentBySlug(slug);

  if (!page) return notFound(); 

  // Generate breadcrumb items based on page data
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: page.Title || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') }
  ];

  return (
    <>
      <HeroSection data={page} />
      <Breadcrumb items={breadcrumbItems} />
      <ContentSection sections={page?.Section || []} />
      <Footer />
    </>
  );
}
