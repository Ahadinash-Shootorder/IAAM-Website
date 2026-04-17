import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import SectionContainer from "../common/SectionContainer";
import { getProxiedImageUrl } from "@/lib/imageProxy";

const API =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
  "https://admin.iaamonline.org";

/* ================= FETCH HOME BLOG SECTION ================= */
async function getBlogSection() {
  try {
    const res = await fetch(
      `${API}/api/home?populate[BlogSection][populate]=FeaturedImage`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.log("Home API failed:", res.status);
      return null;
    }

    const json = await res.json();

    // ✅ STRAPI v5 FIX
    return json?.data?.BlogSection || null;
  } catch (err) {
    console.error("Home fetch error:", err);
    return null;
  }
}

/* ================= FETCH ARTICLES ================= */
async function getArticles() {
  const res = await fetch(
    `${API}/api/articles?populate=blog_category&sort=createdAt:desc&pagination[limit]=6`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.log("Articles API failed");
    return [];
  }

  const json = await res.json();

  return json?.data || [];
}

/* ================= COMPONENT ================= */
export default async function BlogSection() {
  const blog = await getBlogSection();
  const articles = await getArticles();

  if (!blog) {
    return (
      <section className="py-24 text-center text-red-500">
        Failed to load blog section
      </section>
    );
  }

  /* ---------- LEFT DESCRIPTION ---------- */
  const featuredDesc =
    blog.FeaturedDescription?.map((block: any) =>
      block.children?.map((c: any) => c.text).join("")
    ).join(" ") || "";

  /* ---------- FEATURED IMAGE ---------- */
  const featuredImage =
    blog.FeaturedImage?.formats?.large?.url
      ? getProxiedImageUrl(blog.FeaturedImage.formats.large.url)
      : blog.FeaturedImage?.url
        ? getProxiedImageUrl(blog.FeaturedImage.url)
        : "/news-placeholder.jpg";

  return (
    <SectionContainer bgColor="bg-[hsl(210,20%,96%)]">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
          {blog.Title}
        </h2>

        <div className="flex flex-col items-start md:items-end gap-3">
          <span className="text-sm text-slate-500">
            {blog.SubTitle}
          </span>

          <Link
            href={blog.NewsLetterButtonLink || "#"}
            className="bg-[#1e40af] text-white px-5 py-2 text-sm font-semibold rounded hover:bg-[#1e40af] transition"
          >
            {blog.NewsLetterButtonText}
          </Link>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* ===== LEFT FEATURED ===== */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded overflow-hidden shadow">
            <LazyImage
              src={featuredImage}
              alt={blog.FeaturedTitle}
              width={600}
              height={350}
              className="w-full h-48 object-cover"
            />

            <div className="bg-[#1e40af] p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                {blog.FeaturedTitle}
              </h3>

              <p className="text-sm text-white/90">
                {featuredDesc}
              </p>
            </div>
          </div>
        </div>

        {/* ===== RIGHT ARTICLES ===== */}
        <div className="lg:col-span-8">
          <Link
            href={blog.AllArticlesLink || "#"}
            className="inline-flex items-center gap-1 border text-[#1e40af] bg-gray-200 px-4 py-2 text-sm rounded mb-6 hover:bg-gray-100"
          >
            {blog.AllArticlesLink}<ChevronRight className="w-4 h-4" />
          </Link>

          <div className="grid sm:grid-cols-2 gap-4 text-[#1e40af]">
            {articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white border-l-4 border-transparent hover:border-[#1e40af] p-4 rounded shadow transition"
              >
                <h4 className="font-bold mb-2 text-sm md:text-base">
                  {article.Title?.length > 40
                    ? article.Title.slice(0, 40) + "..."
                    : article.Title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}