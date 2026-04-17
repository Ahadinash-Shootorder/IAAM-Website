import { notFound } from "next/navigation";

async function getLegalPage(slug: string) {
  const res = await fetch(
    `https://admin.iaamonline.org/api/legals?filters[Slug][$eq]=${slug}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json?.data?.[0] || null;
}

export default async function LegalPage({ params }: any) {

  const { slug } = await params; // ✅

  const page = await getLegalPage(slug);

  console.log("PAGE:", page); // DEBUG

  if (!page) return notFound();

  return (
  <div className="w-full bg-white">

    {/* HERO SECTION */}
    <div className="w-full bg-[#F5F7FB] border-b">
      <div className="max-w-[1200px] mx-auto px-6 py-14">

        {/* BREADCRUMB */}
        <div className="text-[14px] text-gray-500 mb-4">
          Home <span className="mx-2">/</span>
          <span className="text-[#1C3E9C] font-medium">
            {page.Title}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-[38px] md:text-[42px] font-bold text-[#1C3E9C] leading-tight">
          {page.Title}
        </h1>

      </div>
    </div>

    {/* CONTENT SECTION */}
    <div className="max-w-[1100px] mx-auto px-6 py-14">

      <div className="bg-white rounded-[10px] shadow-sm border p-8 md:p-12">

        {/* CONTENT */}
        <div className="text-[16px] md:text-[17px] text-[#1E1E1E] leading-[1.8]">

          {page.Description?.map((block: any, index: number) => {
            if (block.type === "paragraph") {
              return (
                <p key={index} className="mb-5">
                  {block.children?.map((child: any, i: number) => (
                    <span key={i}>{child.text}</span>
                  ))}
                </p>
              );
            }
            return null;
          })}

        </div>

      </div>

    </div>

  </div>
);
}