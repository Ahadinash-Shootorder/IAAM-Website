import Header from "@/components/Header";
import Footer from "@/components/FooterNew";
import LazyImage from "@/components/common/LazyImage";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

/* -------------------- DATA FETCHERS -------------------- */

async function getEvent(slug: string) {
  const res = await fetch(
    `${API}/api/events?filters[slug][$eq]=${slug}&populate=heroImage`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  const e = json.data?.[0];

  if (!e) return null;

  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    shortDescription: e.shortDescription,
    fullDescription: e.fullDescription,
    eventDate: e.eventDate,
    location: e.location,
    publishOnHome: e.publishOnHome,
    heroImage: e.heroImage,
  };
}

async function getUpcoming(currentSlug: string) {
  const res = await fetch(
    `${API}/api/events?filters[slug][$ne]=${currentSlug}&sort=eventDate:asc&pagination[limit]=3&populate=heroImage`,
    { cache: "no-store" }
  );

  const json = await res.json();

  return json.data || [];
}

/* -------------------- PAGE -------------------- */

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {

  // ✅ FIXED: unwrap params
  const { slug } = await params;

  const event = await getEvent(slug);
  if (!event) notFound();

  const upcoming = await getUpcoming(slug);

  const date = new Date(event.eventDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* ---------------- HERO ---------------- */}
      <div className="relative h-[420px] bg-[hsl(197,63%,22%)]">
        {event.heroImage && (
          <LazyImage
            src={`${API}${event.heroImage.url}`}
            alt={event.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12 max-w-6xl text-white">
            <span className="inline-block mb-4 bg-white/20 px-4 py-1 rounded text-sm font-semibold">
              📍 {event.location} &nbsp; | &nbsp; 🗓 {date}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Description */}
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              {event.shortDescription}
            </p>

            {event.fullDescription && (
              <p className="text-gray-600 leading-relaxed mb-16">
                {event.fullDescription}
              </p>
            )}
          </div>

          {/* ---------------- UPCOMING ---------------- */}
          {upcoming.length > 0 && (
            <>
              <h3 className="text-2xl font-bold mb-8">More Upcoming Events</h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((e: any) => {
                  const d = new Date(e.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <a
                      key={e.id}
                      href={`/events/${e.slug}`}
                      className="group border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
                    >
                      <div className="relative h-44 bg-gray-200">
                        {e.heroImage && (
                          <LazyImage
                            src={`${API}${e.heroImage.url}`}
                            alt={e.title}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-gray-500 mb-2">🗓 {d}</p>
                        <h4 className="font-semibold text-lg leading-snug mb-2 group-hover:text-[hsl(197,63%,22%)]">
                          {e.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {e.shortDescription}
                        </p>
                        {/* <p className="text-sm text-gray-600 line-clamp-3">
                          {e.fullDescription}
                        </p> */}
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
