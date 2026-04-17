import DynamicCategoryPage from "@/app/_shared/DynamicCategoryPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InnovationPage({ params }: PageProps) {
  const { slug } = await params;
  return <DynamicCategoryPage slug={slug} />;
}
