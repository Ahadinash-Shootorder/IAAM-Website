'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { dropdownData } from "@/lib/dropdownData";
import Breadcrumb from "@/components/common/Breadcrumb";

interface Props {
  pageIndex: number;
  title: string;
  slug: string;
}

export default function MobileNavPage({ pageIndex, title, slug }: Props) {
  const router = useRouter();
  const data = dropdownData[pageIndex];

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: title }
  ];

  return (
    <div className="lg:hidden min-h-screen bg-[#f1f1f1]">

      {/* Breadcrumb */}
      <div className="mt-5 px-4 py-0 text-black bg-[#FFFFFF]">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ===== Top Header (Image Matching) ===== */}
      <div className="flex items-center gap-3 px-4 py-4 text-black bg-[#e9e9e9] border-b border-gray-300">

        <button
          onClick={() => router.back()}
          className="p-1"
        >
          <ArrowLeft
            size={24}
            strokeWidth={2.5}
            // className="text-black"
          />
        </button>

        <h1 className="text-[24px] tracking-[0.2px]">
          {title}
        </h1>
      </div>

      {/* ===== Content Area ===== */}
      <div className="px-5 py-6 space-y-7">

        {data.columns.map((column, colIdx) =>
          column.map((section, secIdx) => (
            <div key={`${colIdx}-${secIdx}`} className="space-y-3">

              {/* Section Title */}
              <h2 className="text-[#1e40af] font-semibold text-[20px]">
                {section.header}
              </h2>

              {/* Links */}
              <div className="space-y-2">
                {section.links?.map((link, i) => (
                  <a
                    key={i}
                    href={`/${slug}${link.url}`}
                    className="block text-[16px] text-[#1e40af] leading-[20px]"
                  >
                    {link.text}
                  </a>
                ))}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}
