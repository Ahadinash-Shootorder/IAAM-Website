import Link from "next/link";
import LazyImage from "@/components/common/LazyImage";

const API =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
  "https://admin.iaamonline.org";

/* =========================================================
   FETCH MENU SECTIONS
========================================================= */

async function getFooterMenus() {
  const res = await fetch(
    `${API}/api/menu-sections?filters[MenuPlacement][$eq]=Footer&populate[Links][populate]=Sublinks`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json?.data || [];
}

/* =========================================================
   FETCH CONTACT DATA (INCLUDING LEGAL)
========================================================= */

async function getContactData() {
  const res = await fetch(
    `${API}/api/generals?populate[Communication][populate]=IconImage&populate[SocialMedia][populate]=PlatformLogo&populate[WeChat][populate]=Image&populate[Legal]=true`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data?.[0] || null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default async function Footer() {
  const menus = await getFooterMenus();
  const general = await getContactData();

  const normalize = (str: string) =>
    str?.replace(/\u200B/g, "").trim();

  const getSection = (title: string) =>
    menus.find(
      (m: any) => normalize(m.Title) === normalize(title)
    );

  return (
    <footer className="w-full bg-white border-t pt-14">

      <div className="max-w-[1440px] mx-auto px-[20px]">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[20px] gap-y-10">

          {/* COLUMN 1 */}
          <div className="flex flex-col gap-10">
            <FooterSection section={getSection("Advance Material Congress")} />
            <FooterSection section={getSection("What we do")} />
            <FooterSection section={getSection("Engage with IAAM")} />
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col gap-10">
            <FooterSection section={getSection("Membership")} />
            <FooterSection section={getSection("Community")} />
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col gap-10">
            <FooterSection section={getSection("Meetings, Knowledge & Publishing")} />
            <FooterSection section={getSection("Research, Innovation & Net-Zero")} />
          </div>

          {/* COLUMN 4 */}
          <div className="flex flex-col gap-10">
            <FooterSection section={getSection("Recognition & Engagement")} />
            <FooterSection section={getSection("Funding and Undertakings")} />
            <FooterSection section={getSection("Learn Advanced Materials")} />
          </div>

          {/* COLUMN 5 */}
          <div className="flex flex-col gap-10">
            {/* <FooterSection section={getSection("Contact & Connect")} /> */}
            <FooterSection section={getSection("Legal & Policies")} />
            <FooterSection section={getSection("Resources")} />

            <ContactInfo general={general} />
          </div>

        </div>
      </div>

      {/* ===== EXACT MATCH GRAY SECTION (ORIGINAL LAYOUT) ===== */}
      <div className="w-full bg-black/70 mt-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[30px] py-6 relative">

          {/* RIGHT WATERMARK LOGO */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
            <Link href="/">
              <LazyImage
                src="/IAAM Logo final  White PNG.png"
                alt="IAAM Logo"
                width={90}
                height={80}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* CENTER CONTENT */}
          <div className="flex flex-col items-center text-center gap-3">

            {/* LEGAL LINKS */}
            <div className="flex flex-wrap justify-center items-center text-white font-semibold text-[15px] md:text-[16px] tracking-wide">

              {general?.Legal?.map((item: any, index: number) => (
                <span key={item.id} className="flex items-center">

                  {item.LabelLink ? (
                    <Link
                      href={item.LabelLink}
                      className="hover:underline cursor-pointer px-2"
                    >
                      {item.Label}
                    </Link>
                  ) : (
                    <span className="px-2">{item.Label}</span>
                  )}

                  {index !== general.Legal.length - 1 && (
                    <span className="px-2 opacity-70">|</span>
                  )}

                </span>
              ))}

            </div>

            {/* COPYRIGHT TEXT */}
            <p className="text-white text-[13.5px] md:text-[14px] opacity-90 leading-relaxed max-w-[900px]">
              © International Association of Advanced Materials 2026 - All rights reserved.
            </p>

          </div>

          {/* BELOW DESCRIPTION LINE (FULL WIDTH CENTER) */}
          <p className="text-center text-white text-[13.5px] md:text-[14px] opacity-90">
            IAAM is a global, non-profit scientific organization dedicated to advancing
            materials science, engineering, and technology for the benefit of society.
          </p>

        </div>
      </div>

    </footer>
  );
}

/* =========================================================
   FOOTER SECTION
========================================================= */

function FooterSection({ section }: any) {
  if (!section) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-[16px] text-[#1C3E9C]">
        {section.Title}
      </h3>

      <div className="flex flex-col gap-2">
        {section.Links?.map((link: any) => (
          <Link
            key={link.id}
            href={link.LinkURL || "#"}
            className="text-[15px] text-[#1E1E1E] opacity-90 hover:text-[#1C3E9C]"
          >
            {link.LinkTitle}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CONTACT INFO
========================================================= */

function ContactInfo({ general }: any) {
  if (!general) return null;

  const communication = general?.Communication || [];
  const social = general?.SocialMedia || [];
  const weChat = general?.WeChat;

  return (
    <div className="flex flex-col gap-4">

      <h3 className="font-bold text-[15px] text-[#1C3E9C]">
        Contact Info
      </h3>

      {communication.map((item: any) => {
        const icon = item?.IconImage?.url
          ? API + item.IconImage.url
          : null;

        return (
          <div key={item.id} className="flex items-start gap-3">
            {icon && (
              <LazyImage
                src={icon}
                alt=""
                width={18}
                height={18}
                unoptimized
              />
            )}
            <div className="text-[14px] leading-snug">
              <p className="font-medium text-[#1E1E1E]">
                {item.Label}
              </p>
              <p className="text-[#1E1E1E] opacity-90">
                {item.Description}
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex gap-8 items-start">

        {weChat?.Image?.url && (
          <div>
            <p className="font-bold text-[#1C3E9C] mb-2">
              {weChat.Title}
            </p>
            <LazyImage
              src={API + weChat.Image.url}
              alt="WeChat"
              width={75}
              height={75}
              unoptimized
            />
          </div>
        )}

        <div>
          <p className="font-bold text-[#1C3E9C] mb-2">
            Follow Us On
          </p>

          <div className="flex gap-1">
            {social.map((s: any) => (
              <Link
                key={s.id}
                href={s.PlatformNameLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
              >
                <LazyImage
                  src={API + s.PlatformLogo.url}
                  alt={s.PlatformName}
                  width={14}
                  height={14}
                  unoptimized
                />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}