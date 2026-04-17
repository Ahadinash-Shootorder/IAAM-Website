import MobileNavPage from "@/app/_shared/MobileNavPage";
import DynamicCategoryPage from "@/app/_shared/DynamicCategoryPage";

interface Props {
  slug: string;
  pageIndex: number;
  title: string;
}

export default function ResponsiveCategoryPage({
  slug,
  pageIndex,
  title,
}: Props) {
  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="lg:hidden">
        <MobileNavPage
          pageIndex={pageIndex}
          title={title}
          slug={slug}
        />
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden lg:block">
        <DynamicCategoryPage slug={slug} />
      </div>
    </>
  );
}
