import Footer from "@/components/FooterNew";
import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

interface Event {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: {
    url: string;
  };
}

async function getEventsPage() {
  const baseUrl = API?.replace(/\/$/, '') || 'http://admin.iaamonline.org';
  const res = await fetch(
    `${baseUrl}/api/event-page?populate[featuredEvent][populate]=heroImage&populate[upcomingEvents][populate]=heroImage`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
}

export default async function EventsPage() {
  const data = await getEventsPage();
  if (!data) return null;

  const {
    pageTitle,
    heroTitle,
    heroSubtitle,
    heroImage,
    featuredEvent,
    upcomingEvents,
  } = data;

  return (
    <div className="bg-white min-h-screen">

      {/* ---------------- HERO ---------------- */}
      <div className="relative bg-[hsl(197,63%,22%)]">
        <div className="container mx-auto px-6 py-20 max-w-7xl grid lg:grid-cols-2 gap-12 items-center text-white">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {pageTitle}
            </h1>
            <h2 className="text-xl md:text-2xl text-white/90 mb-4">
              {heroTitle}
            </h2>
            <p className="text-white/80 max-w-xl">
              {heroSubtitle}
            </p>
          </div>

          {heroImage && (
            <div className="relative h-[320px] md:h-[380px] rounded-xl overflow-hidden shadow-xl">
              <LazyImage
                src={`${API}${heroImage.url.startsWith('/') ? '' : '/'}${heroImage.url}`}
                alt={heroTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* ---------------- FEATURED ---------------- */}
      {featuredEvent && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">

            <h3 className="text-2xl md:text-3xl font-bold mb-10">
              Featured Event
            </h3>

            <Link
              href={`/events/${featuredEvent.slug}`}
              className="group block"
            >
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl border shadow hover:shadow-xl transition overflow-hidden">

                <div className="relative h-[260px] md:h-full">
                  <LazyImage
                    src={`${API}${featuredEvent.heroImage.url.startsWith('/') ? '' : '/'}${featuredEvent.heroImage.url}`}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-8 flex flex-col justify-center">
                  <h4 className="text-xl md:text-2xl font-bold mb-4">
                    {featuredEvent.title}
                  </h4>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {featuredEvent.shortDescription}
                  </p>

                  <span className="inline-block w-fit bg-[hsl(197,63%,22%)] text-white px-6 py-3 rounded-md font-semibold">
                    View Event →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ---------------- UPCOMING ---------------- */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-7xl">

          <h3 className="text-2xl md:text-3xl font-bold mb-12">
            Upcoming Events
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event: Event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group bg-white rounded-xl overflow-hidden border hover:shadow-xl transition"
              >
                <div className="relative h-48">
                  <LazyImage
                    src={`${API}${event.heroImage.url.startsWith('/') ? '' : '/'}${event.heroImage.url}`}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-lg leading-snug mb-3 group-hover:text-[hsl(197,63%,22%)] transition">
                    {event.title}
                  </h4>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {event.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
