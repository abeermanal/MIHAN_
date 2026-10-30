import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blog-posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    route: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "daily" | "yearly";
  }[] = [
    { route: "", priority: 1, changeFrequency: "weekly" },
    { route: "/assessment", priority: 0.9, changeFrequency: "weekly" },
    { route: "/opportunities", priority: 0.9, changeFrequency: "daily" },
    { route: "/learning-path", priority: 0.8, changeFrequency: "weekly" },
    { route: "/coach", priority: 0.8, changeFrequency: "weekly" },
    { route: "/return-path", priority: 0.8, changeFrequency: "weekly" },
    { route: "/blog", priority: 0.9, changeFrequency: "weekly" },
    { route: "/about", priority: 0.6, changeFrequency: "monthly" },
    { route: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { route: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { route: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const routes = staticRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...posts];
}