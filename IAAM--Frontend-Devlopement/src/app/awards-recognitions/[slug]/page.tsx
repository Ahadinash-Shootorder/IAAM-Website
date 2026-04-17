import DynamicCategoryPage from "@/app/_shared/DynamicCategoryPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AwardsPage({ params }: PageProps) {
  const { slug } = await params;
  return <DynamicCategoryPage slug={slug} />;
}
