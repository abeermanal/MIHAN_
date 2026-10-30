import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, getBlogCategories } from "@/data/blog-posts";
import AdUnit from "@/components/AdUnit";
import { ADSENSE_SLOTS } from "@/lib/ads";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "المدونة",
  description:
    "مقالات عربية عملية تساعد النساء على بناء السيرة الذاتية، اكتشاف المهارات، الاستعداد للمقابلات، والتقدم في العمل الحر — من منصة مِهَن.",
  keywords: [
    "مدونة",
    "مقالات",
    "السيرة الذاتية",
    "المقابلات",
    "مهارات",
    "العمل الحر",
    "مِهَن",
  ],
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "مدونة مِهَن — مقالات عملية للمسار المهني",
    description:
      "أدلة عربية خطوة بخطوة للسيرة الذاتية،Preparation للمقابلات، وبناء المهارات من الصفر.",
    url: `${siteUrl}/blog`,
    locale: "ar_AR",
    type: "website",
  },
};

const arDate = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function readingMinutes(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPage() {
  const categories = getBlogCategories();
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="space-y-14">
      <header className="space-y-4 text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-bold"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
        >
          مدونة مِهَن
        </span>
        <h1 className="section-title">مقالات تساعدك على خطوة مهنية حقيقية</h1>
        <p
          className="mx-auto max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          أدلة عربية عملية بلغة بسيطة: كيف تكتبين سيرتك، وتستعدين لمقابلة، وتبنيين
          مهاراتك، وتطلبين أجراً يستحق تعبك. مقالات طويلة ومجانية تماماً.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border px-3.5 py-1.5 text-xs font-bold"
              style={{ borderColor: "var(--border)", color: "var(--muted-strong)" }}
            >
              {category}
            </span>
          ))}
        </div>
      </header>

      {featured && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold" style={{ color: "var(--heading)" }}>
            الأحدث على مِهَن
          </h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="card block overflow-hidden transition-all duration-300"
          >
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                  <span style={{ color: "var(--accent)" }}>{featured.category}</span>
                  <span style={{ color: "var(--muted)" }}>
                    {arDate.format(new Date(featured.date))}
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {readingMinutes(featured.content)} دقائق قراءة
                  </span>
                </div>
                <h3
                  className="text-2xl font-extrabold leading-snug md:text-3xl"
                  style={{ color: "var(--heading)" }}
                >
                  {featured.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {featured.excerpt}
                </p>
                <span
                  className="inline-block text-sm font-bold"
                  style={{ color: "var(--link)" }}
                >
                  اقرئي المقال كاملاً ←
                </span>
              </div>
              <div
                className="aspect-[16/10] w-full rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--surface-raised), var(--surface-overlay))",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          </Link>
        </section>
      )}

      <AdUnit
        slot={ADSENSE_SLOTS.blogTop}
        format="horizontal"
        className="min-h-[90px]"
      />

      <section className="space-y-6">
        <h2 className="text-lg font-extrabold" style={{ color: "var(--heading)" }}>
          كل المقالات
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card flex flex-col gap-3 transition-all duration-300"
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span style={{ color: "var(--accent)" }}>{post.category}</span>
                <span style={{ color: "var(--muted)" }}>{post.date}</span>
              </div>
              <h3
                className="text-lg font-extrabold leading-snug"
                style={{ color: "var(--heading)" }}
              >
                {post.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {post.excerpt}
              </p>
              <span
                className="mt-auto pt-2 text-xs font-bold"
                style={{ color: "var(--link)" }}
              >
                اقرئي المقال ←
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdUnit
        slot={ADSENSE_SLOTS.blogBottom}
        format="rectangle"
        className="min-h-[250px]"
      />

      <section
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <h2 className="mb-3 text-xl font-extrabold" style={{ color: "var(--heading)" }}>
        لا تقرئين فقط، ابدئي بقياس مهاراتك
        </h2>
        <p className="mx-auto mb-6 max-w-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          اختبار مِهَن المجاني يستغرق دقائق، ويحدّد نقاط قوتك والخطوة التالية في مسارك
          المهني.
        </p>
        <Link href="/assessment" className="btn-primary">
          ابدئي الاختبار الآن
        </Link>
      </section>
    </div>
  );
}