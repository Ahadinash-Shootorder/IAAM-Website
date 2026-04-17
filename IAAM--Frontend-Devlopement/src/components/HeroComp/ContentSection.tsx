"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import LazyImage from "@/components/common/LazyImage";

const API =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
  "http://admin.iaamonline.org";

export default function ContentSection({ sections = [] }: any) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!Array.isArray(sections)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s: any) => {
      if (!s?.Heading) return;
      const id = s.Heading.replace(/\s+/g, "-");
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!sections.length) return null;

  return (
    <div className="bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ================= SIDEBAR ================= */}
          <aside className="w-full lg:w-[300px] lg:sticky lg:top-60 self-start">
            <div className="flex items-center gap-2 mb-4 text-[15px] font-medium text-gray-900">
              <List size={18} />
              Page contents
            </div>

            <div className="relative border-l border-gray-300">
              <ul className="space-y-1">
                {sections.map((s: any, i: number) => {
                  if (!s?.Heading) return null;

                  const id = s.Heading.replace(/\s+/g, "-");
                  const isActive = active === id;

                  return (
                    <li key={i} className="relative">
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-600 rounded-full" />
                      )}

                      <button
                        onClick={() => scrollToSection(id)}
                        className={`w-full text-left pl-6 pr-3 py-2 transition text-[18px]
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-900 font-medium"
                              : "text-gray-800 hover:bg-gray-100"
                          }
                        `}
                      >
                        {s.Heading}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ================= CONTENT ================= */}
          <main className="flex-1 space-y-16">
  {sections.map((s: any, i: number) => {
    if (!s?.Heading) return null;

    const id = s.Heading.replace(/\s+/g, "-");

    const imageUrl =
      s?.Image?.url &&
      (s?.ImagePostion === "Left" || s?.ImagePostion === "Right")
        ? `${API}${s.Image.url}`
        : null;

    const isRight = s?.ImagePostion === "Right";

    return (
      <section id={id} key={i} className="scroll-mt-60">

        {imageUrl ? (
          <div
            className={`flex flex-col lg:flex-row gap-10 items-start
              ${isRight ? "lg:flex-row-reverse" : ""}
            `}
          >
            {/* IMAGE */}
            <div className="w-full lg:w-[40%] order-2 lg:order-none">
              <LazyImage
                src={imageUrl}
                alt={s?.Heading}
                width={400}
                height={350}
                className="w-full max-h-[350px] object-contain rounded-lg"
              />
            </div>

            {/* TEXT BLOCK */}
            <div className="w-full lg:w-[60%] text-gray-800 space-y-6">

              {/* HEADING */}
              <h2 className="text-[40px] leading-[48px] font-light">
                {s.Heading}
              </h2>

              {/* DESCRIPTION */}
              <div className="text-[18px] leading-[28px] space-y-4">
                {Array.isArray(s.Description) &&
                  s.Description.map((block: any, idx: number) => {
                    if (block.type === "paragraph") {
                      return (
                        <p key={idx}>
                          {block.children?.[0]?.text}
                        </p>
                      );
                    }
                    
                    if (block.type === "list") {
                      const ListTag = block.format === "ordered" ? "ol" : "ul";
                      return (
                        <ListTag key={idx} className={block.format === "ordered" ? "list-decimal pl-6 space-y-1" : "list-disc pl-6 space-y-1"}>
                          {block.children?.map((item: any, itemIdx: number) => (
                            <li key={itemIdx}>
                              {item.children?.map((child: any, childIdx: number) => (
                                <span key={childIdx}>{child.text}</span>
                              ))}
                            </li>
                          ))}
                        </ListTag>
                      );
                    }
                    
                    return null;
                  })}
              </div>

            </div>
          </div>
        ) : (
          /* ===== NO IMAGE ===== */
          <div className="max-w-3xl text-gray-800 space-y-6">
            <h2 className="text-[40px] leading-[48px] font-light">
              {s.Heading}
            </h2>

            <div className="text-[18px] leading-[28px] space-y-4">
              {Array.isArray(s.Description) &&
                s.Description.map((block: any, idx: number) => {
                  if (block.type === "paragraph") {
                    return (
                      <p key={idx}>
                        {block.children?.[0]?.text}
                      </p>
                    );
                  }
                  
                  if (block.type === "list") {
                    const ListTag = block.format === "ordered" ? "ol" : "ul";
                    return (
                      <ListTag key={idx} className={block.format === "ordered" ? "list-decimal pl-6 space-y-1" : "list-disc pl-6 space-y-1"}>
                        {block.children?.map((item: any, itemIdx: number) => (
                          <li className="lg:ml-[-7px]" key={itemIdx}>
                            {item.children?.map((child: any, childIdx: number) => (
                              <span key={childIdx} className="ml-[-5px]">{child.text}</span>
                            ))}
                          </li>
                        ))}
                      </ListTag>
                    );
                  }
                  
                  return null;
                })}
            </div>
          </div>
        )}

      </section>
    );
  })}
</main>
        </div>
      </div>
    </div>
  );
}
