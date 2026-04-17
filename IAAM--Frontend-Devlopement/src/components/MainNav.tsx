'use client';

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import LazyImage from "@/components/common/LazyImage";
import { useRouter } from "next/navigation";
import { dropdownData, DropdownDataItem } from "@/lib/dropdownData";
import MobileAuth from "@/app/_shared/MobileAuth";

interface MainNavProps {
  mobileMenuOpen: boolean;
  onCloseDrawer?: () => void;
}

export default function MainNav({ mobileMenuOpen, onCloseDrawer }: MainNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const navItems = [
    { title: "Membership", slug: "membership" },
    { title: "Meetings & Events", slug: "meetings-events" },
    { title: "Innovation & Sustainability", slug: "innovation-sustainability" },
    { title: "Journals & Proceedings", slug: "journals-proceedings" },
    { title: "Awards & Recognitions", slug: "awards-recognitions" },
    { title: "Discover IAAM", slug: "discover-iaam" },
  ];

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(index);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const navigateTo = (url: string) => {
    setActiveDropdown(null);
    router.push(url);
  };

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <nav className="hidden lg:block w-full bg-white border-b border-border relative">
        <div className="max-w-[1440px] mx-auto px-[30px]">
          <ul className="flex items-center justify-between h-[48px]">
            {navItems.map((item, index) => (
              <li key={item.title} className="h-full flex items-center">
                <button
                  type="button"
                  className="font-semibold text-[15px] text-iaam-text-dark hover:text-iaam-primary transition-colors flex items-center gap-1 px-2 py-2"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.title}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      activeDropdown === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === index && (
                  <div
                    className="absolute inset-x-0 top-full bg-white z-50 border-b border-border max-h-[calc(100vh-140px)] overflow-y-auto shadow-sm"
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="max-w-[1440px] mx-auto px-[30px] py-[25px]">
                      <DropdownContent
                        data={dropdownData[index]}
                        parentSlug={item.slug}
                        navigateTo={navigateTo}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-b border-border">
          {/* Mobile Auth Section - Top */}
          <MobileAuth onCloseDrawer={onCloseDrawer} />

          {/* Navigation Items */}
          <div className="px-4 py-2 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {navItems.map((item, index) => (
              <MobileNavItem
                key={item.title}
                title={item.title}
                data={dropdownData[index]}
                parentSlug={item.slug}
                navigateTo={navigateTo}
              />
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

/* ================= DESKTOP DROPDOWN CONTENT ================= */

const DropdownContent = ({
  data,
  parentSlug,
  navigateTo,
}: {
  data: DropdownDataItem;
  parentSlug: string;
  navigateTo: (url: string) => void;
}) => {
  return (
    <div className="flex gap-[30px] pb-4 items-stretch">
      {/* LEFT CARD */}
      <div className="w-[26%] flex-shrink-0 bg-iaam-bg-gray rounded overflow-hidden">
        <div className="h-[300px] bg-white overflow-hidden relative">
          <LazyImage
            src={
              data.card.image.startsWith("http")
                ? data.card.image
                : `/${data.card.image}`
            }
            alt={data.card.title}
            fill
            className="object-contain"
          />
        </div>
        <button
          onClick={() => navigateTo(`/${parentSlug}${data.card.ctaUrl}`)}
          className="w-full py-[10px] px-[8px] bg-iaam-primary text-white text-[20px] translate-y-[-20%] font-bold shadow-md hover:brightness-110 transition text-center"
        >
          {data.card.cta}
        </button>

        <div className="p-[8px] pt-[24px] flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-[20px] text-iaam-text-dark leading-tight tracking-[0.3px]">
              {data.card.title}
            </h3>
            <p className="text-[16px] text-iaam-text-body leading-[17px] mt-2">
              {data.card.description}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <div>
          <h2 className="font-bold text-[24px] text-iaam-text-dark tracking-[0.36px]">
            {data.title}
          </h2>
          <p className="text-[18px] text-iaam-text-body leading-[25px] mt-4">
            {data.description}
          </p>
        </div>

        {(data.outlineCta || data.rightLinks) && (
          <div className="flex justify-between items-start w-full">
            {data.outlineCta && data.outlineCtaUrl && (
              <button
                onClick={() => navigateTo(`/${parentSlug}${data.outlineCtaUrl}`)}
                className="py-[16px] px-[8px] border border-iaam-primary text-iaam-primary font-medium text-[16px] rounded-[3px] hover:bg-iaam-primary hover:text-white transition"
              >
                {data.outlineCta}
              </button>
            )}

            {data.rightLinks && (
              <div className="flex flex-col gap-4 text-right ml-auto">
                {data.rightLinks.map((rl, idx) =>
                  rl.headerUrl ? (
                    <button
                      key={idx}
                      onClick={() => navigateTo(`/${parentSlug}${rl.headerUrl}`)}
                      className="font-bold text-[18px] text-iaam-primary hover:underline text-right"
                    >
                      {rl.header}
                    </button>
                  ) : (
                    <span
                      key={idx}
                      className="font-bold text-[18px] text-iaam-primary"
                    >
                      {rl.header}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {data.title === "Meeting & Events" && (
          <div className="w-full py-[9px] px-[8px] bg-iaam-primary">
            <span className="font-roboto font-semibold text-[18px] text-white tracking-[0.27px]">
              Guideline for Abstract Submission & Conference Registration​
            </span>
          </div>
        )}

        <div className="flex gap-7 w-full">
          {data.columns.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-7 flex-1 min-w-0">
              {column.map((section, secIdx) => (
                <div key={secIdx} className="flex flex-col gap-3">
                  {section.headerUrl ? (
                    <button
                      onClick={() => navigateTo(`/${parentSlug}${section.headerUrl}`)}
                      className="font-bold text-[18px] text-iaam-section-header hover:text-iaam-primary transition-colors text-left"
                    >
                      {section.header}
                    </button>
                  ) : (
                    <h4 className="font-bold text-[18px] text-iaam-section-header">
                      {section.header}
                    </h4>
                  )}

                  {section.links && (
                    <div className="flex flex-col gap-4">
                      {section.links.map((link, linkIdx) => (
                        <button
                          key={linkIdx}
                          onClick={() => navigateTo(`/${parentSlug}${link.url}`)}
                          className="text-left text-[16px] text-[#1e40af]/70 hover:underline hover:text-iaam-primary transition-colors"
                        >
                          {link.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================= MOBILE NAV ITEM ================= */

const MobileNavItem = ({
  title,
  data,
  parentSlug,
  navigateTo,
}: {
  title: string;
  data: DropdownDataItem;
  parentSlug: string;
  navigateTo: (url: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 px-2 font-semibold text-[16px] text-iaam-text-dark"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-2 pb-4 space-y-4">
          <p className="text-[14px] text-iaam-text-body">
            {data.description}
          </p>

          <button
            onClick={() => navigateTo(`/${parentSlug}${data.card.ctaUrl}`)}
            className="block w-full py-[10px] px-[8px] bg-iaam-primary text-white font-medium text-[16px] rounded-[3px] shadow-md hover:brightness-110 transition text-center"
          >
            {data.card.cta}
          </button>

          {data.outlineCta && data.outlineCtaUrl && (
            <button
              onClick={() => navigateTo(`/${parentSlug}${data.outlineCtaUrl}`)}
              className="block w-full py-[10px] px-[8px] border border-iaam-primary text-iaam-primary font-medium text-[14px] rounded-[3px] hover:bg-iaam-primary hover:text-white transition text-center"
            >
              {data.outlineCta}
            </button>
          )}

          {data.rightLinks && (
            <div className="space-y-2">
              {data.rightLinks.map((rl, idx) =>
                rl.headerUrl ? (
                  <button
                    key={idx}
                    onClick={() => navigateTo(`/${parentSlug}${rl.headerUrl}`)}
                    className="block font-bold text-[14px] text-iaam-primary hover:underline text-left"
                  >
                    {rl.header}
                  </button>
                ) : (
                  <span
                    key={idx}
                    className="block font-bold text-[14px] text-iaam-primary"
                  >
                    {rl.header}
                  </span>
                )
              )}
            </div>
          )}

          {data.columns.map((column, colIdx) => (
            <div key={colIdx} className="space-y-3">
              {column.map((section, secIdx) => (
                <div key={secIdx}>
                  {section.headerUrl ? (
                    <button
                      onClick={() => navigateTo(`/${parentSlug}${section.headerUrl}`)}
                      className="font-bold text-[14px] text-iaam-section-header hover:text-iaam-primary transition-colors text-left"
                    >
                      {section.header}
                    </button>
                  ) : (
                    <h5 className="font-bold text-[14px] text-iaam-section-header">
                      {section.header}
                    </h5>
                  )}

                  {section.links && (
                    <div className="ml-2 mt-1 space-y-1">
                      {section.links.map((link, i) => (
                        <button
                          key={i}
                          onClick={() => navigateTo(`/${parentSlug}${link.url}`)}
                          className="block text-left text-[13px] text-iaam-link-light hover:underline"
                        >
                          {link.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
