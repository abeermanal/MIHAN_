import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BLOG_POSTS,
  getPostBySlug,
  getRelatedPosts,
  type BlogPost,
} from "@/data/blog-posts";
import BlogArticle from "@/components/BlogArticle";
import AdUnit from "@/components/AdUnit";
import { ADSENSE_SLOTS } from "@/lib/ads";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const arDate = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "المقال غير موجود" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, post.title, "مِهَن", "مدونة"],
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      locale: "ar_AR",
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

function readingMinutes(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card flex flex-col gap-2 transition-all duration-300"
    >
      <span className="text-[11px] font-bold" style={{ color: "var(--accent)" }}>
        {post.category}
      </span>
      <span className="font-extrabold leading-snug" style={{ color: "var(--heading)" }}>
        {post.title}
      </span>
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        {readingMinutes(post.content)} دقائق قراءة
      </span>
    </Link>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <nav className="text-xs font-bold" style={{ color: "var(--muted)" }}>
        <Link href="/" className="transition hover:text-[var(--link)]">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="transition hover:text-[var(--link)]">
          المدونة
        </Link>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span
            className="rounded-full px-3 py-1.5"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
          >
            {post.category}
          </span>
          <span style={{ color: "var(--muted)" }}>
            {arDate.format(new Date(post.date))}
          </span>
          <span style={{ color: "var(--muted)" }}>
            {readingMinutes(post.content)} دقائق قراءة
          </span>
        </div>

        <h1 className="text-3xl font-extrabold leading-snug md:text-4xl" style={{ color: "var(--heading)" }}>
          {post.title}
        </h1>

        <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {post.excerpt}
        </p>

        <div
          className="flex items-center gap-3 border-t pt-4 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-xs font-extrabold"
            style={{
              background: "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
              color: "#0A1F1F",
            }}
          >
            {post.author.trim().slice(0, 1)}
          </span>
          <span>
            بقلم{" "}
            <span className="font-bold" style={{ color: "var(--text)" }}>
              {post.author}
            </span>
          </span>
        </div>
      </header>

      <div
        className="aspect-[16/7] w-full rounded-2xl"
        style={{
          background: "linear-gradient(135deg, var(--surface-raised), var(--surface-overlay))",
          border: "1px solid var(--border)",
        }}
      />

      <BlogArticle
        post={post}
        ad={
          <AdUnit
            slot={ADSENSE_SLOTS.inArticle}
            layout="in-article"
            format="fluid"
            className="min-h-[90px]"
          />
        }
      />

      {related.length > 0 && (
        <section className="space-y-5 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--heading)" }}>
            مقالات ذات صلة
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <RelatedCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}