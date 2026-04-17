import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

const API =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
  "http://admin.iaamonline.org";

// Cache for EventsSection data
let eventsSectionCache: any = null;
let eventsCacheTime = 0;
const EVENTS_CACHE_DURATION = 300000; // 5 minutes

/* -------- Rich text renderer -------- */
function renderRichText(blocks: any[]) {
  if (!Array.isArray(blocks)) return null;

  return blocks.map((block, i) => (
    <p
      key={i}
      className="text-[hsl(210,20%,30%)] leading-relaxed mt-3"
    >
      {block.children?.map((c: any) => c.text).join("")}
    </p>
  ));
}

/* ================= COMPONENT ================= */
export default async function EventsSection() {
  const now = Date.now();
  
  // Check if we have valid cached data
  if (eventsSectionCache && (now - eventsCacheTime) < EVENTS_CACHE_DURATION) {
    const info = eventsSectionCache;
    const imageUrl = info.Image?.url ? getProxiedImageUrl(info.Image.url) : "";
    
    return renderEventsContent(info, imageUrl);
  }

  try {
    const res = await fetch(
      `${API}/api/home?populate[EventSection][populate][Eventinformation][populate]=Image`,
      { 
        cache: "force-cache",
        next: { revalidate: 300 }
      }
    );

    if (!res.ok) {
      if (eventsSectionCache) {
        const imageUrl = eventsSectionCache.Image?.url ? getProxiedImageUrl(eventsSectionCache.Image.url) : "";
        return renderEventsContent(eventsSectionCache, imageUrl);
      }
      return null;
    }

    const json = await res.json();
    const info = json?.data?.EventSection?.Eventinformation;
    if (!info) return null;

    // Update cache
    eventsSectionCache = info;
    eventsCacheTime = now;

    const imageUrl = info.Image?.url ? getProxiedImageUrl(info.Image.url) : "";
    return renderEventsContent(info, imageUrl);
  } catch (error) {
    console.error("EventsSection error:", error);
    if (eventsSectionCache) {
      const imageUrl = eventsSectionCache.Image?.url ? getProxiedImageUrl(eventsSectionCache.Image.url) : "";
      return renderEventsContent(eventsSectionCache, imageUrl);
    }
    return null;
  }
}

function renderEventsContent(info: any, imageUrl: string) {

  /* -------- RIGHT SIDE STATIC DATA -------- */
  const events = [
    {
      month: "MARCH",
      day: "30",
      title:
        "The 10th Anniversary International Conference on Materials Science & Technology, 30 March",
      description:
        " – 1 April 2026, joins global experts to explore and discuss breakthroughs in materials science and technological innovation.",
    },
    {
      month: "JUNE",
      day: "01",
      title:
        "The 8th Anniversary European Advanced Energy Materials Congress,",
      description:
        " 01 – 03 June 2026, gathers researchers, industry professionals, policymakers, and academics to examine new developments shaping the future of energy materials.",
    },
    {
      month: "AUGUST",
      day: "25",
      title:
        "The European Advanced Materials Congress,",
      description:
        " 25 – 27 August 2026, celebrates 12 years of leadership in advanced materials research and innovation. Participants will engage with cutting-edge findings, emerging technologies, and transformative solutions across the broader materials domain.",
    },
  ];

  return (
    <SectionContainer>
      {/* ===== TITLE ===== */}
      <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl text-[hsl(210,20%,20%)] font-bold mb-10 md:mb-12">
        Upcoming Events
      </h2>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* ================= LEFT ================= */}
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-4">
            {imageUrl && (
              <LazyImage
                src={imageUrl}
                alt={info.Title}
                width={800}
                height={400}
                className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-sm shadow-md"
                priority
              />
            )}

            <h3 className="font-sans text-2xl md:text-3xl font-bold text-[#1e40af]">
              {info.Title}
            </h3>

            {renderRichText(info.Description)}
          </div>

          {/* LEFT BUTTON (BOTTOM + CENTERED) */}
          <div className="flex justify-center mt-8">
            <Link
              href="#"
              className="inline-block text-center bg-[#1e40af] text-white px-6 py-3 font-semibold rounded hover:bg-[#1e40af] transition-colors"
            >
              {info.ButtonLabel}
            </Link>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex flex-col justify-between h-full">
          {/* TABLE */}
          <div className="bg-white border-2 border-[#1e40af] rounded-sm overflow-hidden shadow-md">
            <div className="text-center py-2 border-b-2 border-[#1e40af]">
              <h3 className="font-sans text-xl md:text-2xl font-bold text-[#1e40af]">
                Advanced Materials Congress
              </h3>
              <p className="text-sm md:text-base text-[#1e40af] mt-1">
                Assemblies
              </p>
            </div>

            <div className="divide-y-2 divide-[#1e40af]">
              {events.map((event, index) => (
                <div key={index} className="flex">
                  <div className="w-16 md:w-24 shrink-0 border-r-2 border-[#1e40af] flex flex-col items-center justify-center py-2">
                    <span className="text-xs uppercase tracking-wider text-[#1e40af]">
                      {event.month}
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-[#1e40af] mt-1">
                      {event.day}
                    </span>
                  </div>

                  <div className="p-2 md:p-3">
                    <p className="text-[13px] md:text-[15px] text-gray-700 leading-relaxed">
                      <span className="font-bold text-gray-900">
                        {event.title}
                      </span>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BUTTON (BOTTOM + CENTERED) */}
          <div className="flex justify-center mt-8">
            <Link
              href="#"
              className="inline-block text-center bg-[#1e40af] text-white px-6 py-3 font-semibold rounded hover:bg-[#152f8c] transition-colors"
            >
              Visit Congress Website
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}





































































// import Image from "next/image";
// import Link from "next/link";
// import SectionContainer from "../common/SectionContainer";
// import { getProxiedImageUrl } from "@/lib/imageProxy";

// const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// type Event = {
//   id: number;
//   title: string;
//   slug: string;
//   shortDescription: string;
//   eventDate: string;
//   heroImage?: {
//     url: string;
//   };
// };

// export default async function EventsSection() {
//   try {
//     const baseUrl = NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
//     const response = await fetch(
//       `${baseUrl}/api/events?populate=*`,
//       {
//         next: { revalidate: 60 },
//       }
//     );

//     let events: Event[] = [];
//     try {
//       if (response.ok) {
//         const json = await response.json();
//         events = json.data || [];
//       }
//     } catch (e) {
//       console.error("Error parsing events:", e);
//     }

//     const featured: Event | null = events[0] || null;
//     const upcoming: Event[] = events;

//     if (!featured && upcoming.length === 0) {
//       return (
//         <SectionContainer>
//           <p className="text-center">No events available at the moment.</p>
//         </SectionContainer>
//       );
//     }

//     return (
//       <SectionContainer>
//         <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl text-[hsl(210,20%,20%)] font-bold mb-10 md:mb-12">
//           Upcoming Events
//         </h2>

//         <div className="grid lg:grid-cols-2 gap-10 items-start">
//           {/* LEFT — Featured Event */}
//           {featured && (
//             <div className="space-y-6">
//               {featured.heroImage?.url && (
//                 <LazyImage // Replace Image with LazyImage
//                   src={getProxiedImageUrl(featured.heroImage.url)}
//                   alt={featured.title}
//                   width={800}
//                   height={400}
//                   className="w-full h-56 lg:h-64 object-cover rounded-md shadow-md"
//                   priority
//                 />
//               )}

//               <div className="space-y-4">
//                 <h3 className="text-2xl md:text-3xl font-bold text-[hsl(197,63%,22%)]">
//                   {featured.title}
//                 </h3>

//                 <p className="text-[hsl(210,20%,30%)] leading-relaxed">
//                   {featured.shortDescription}
//                 </p>

//                 <div className="flex gap-4 pt-6">
//                   <Link
//                     href={`/events/${featured.slug}`}
//                     className="bg-[hsl(197,63%,22%)] text-white px-6 py-3 font-semibold rounded hover:bg-[hsl(197,63%,18%)] transition"
//                   >
//                     View Event
//                   </Link>

//                   <Link
//                     href="/events"
//                     className="bg-[hsl(197,63%,22%)] text-white px-6 py-3 font-semibold rounded hover:bg-[hsl(197,63%,18%)] transition"
//                   >
//                     All Events
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* RIGHT — Upcoming Events Table */}
//           <div className="border-2 border-[hsl(197,63%,22%)] rounded-md overflow-hidden shadow-md bg-white">
//             {/* Header */}
//             <div className="text-center py-4 border-b-2 border-[hsl(197,63%,22%)] bg-[hsl(197,63%,95%)]">
//               <h3 className="text-2xl font-bold text-[hsl(197,63%,22%)]">
//                 Advanced Materials Congress
//               </h3>
//               <p className="text-sm text-[hsl(197,63%,40%)]">Assemblies</p>
//             </div>

//             {/* Events */}
//             <div>
//               {upcoming.slice(0, 3).map((event) => {
//                 const date = new Date(event.eventDate);
//                 const month = date.toLocaleString("en-US", { month: "short" });
//                 const day = String(date.getDate()).padStart(2, "0");

//                 return (
//                   <Link
//                     key={event.id}
//                     href={`/events/${event.slug}`}
//                     className="grid grid-cols-[90px_1fr] border-b-2 last:border-b-0 border-[hsl(197,63%,22%)] hover:bg-[hsl(197,63%,97%)] transition cursor-pointer"
//                   >
//                     {/* Date Column */}
//                     <div className="flex flex-col items-center justify-center py-6 bg-[hsl(197,63%,98%)] border-r-2 border-[hsl(197,63%,22%)]">
//                       <span className="text-xs uppercase tracking-wider text-[hsl(197,63%,40%)]">
//                         {month}
//                       </span>
//                       <span className="text-3xl font-bold text-[hsl(197,63%,22%)]">
//                         {day}
//                       </span>
//                     </div>

//                     {/* Content Column */}
//                     <div className="px-5 py-6">
//                       <p className="text-sm text-[hsl(210,20%,20%)] leading-relaxed">
//                         <span className="font-bold text-[hsl(197,63%,22%)] block mb-1">
//                           {event.title}
//                         </span>
//                         {event.shortDescription}
//                       </p>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </SectionContainer>
//     );
//   } catch (error) {
//     console.error("EventsSection error:", error);
//     return (
//       <SectionContainer>
//         <p className="text-center text-red-500">Failed to load events</p>
//       </SectionContainer>
//     );
//   }
// }

