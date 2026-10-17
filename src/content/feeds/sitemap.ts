import { getAllPosts, getAllCategoriesWithCounts, getPostsByCategory } from "../api";
import { SITE_URL } from "./constants";
import type { CategorySlug } from "../types";

interface SitemapOptions {
  siteUrl?: string;
}

interface SitemapRoute {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDate(value: string | undefined): string | undefined {
  return value?.slice(0, 10);
}

export function generateSitemap({ siteUrl = SITE_URL }: SitemapOptions = {}): string {
  const posts = getAllPosts();
  const categories = getAllCategoriesWithCounts();
  const latestPostDate = isoDate(posts[0]?.updatedAt ?? posts[0]?.publishedAt);

  const staticRoutes: SitemapRoute[] = [
    { loc: "/", lastmod: latestPostDate, priority: "1.0", changefreq: "daily" },
    { loc: "/about", priority: "0.6", changefreq: "monthly" },
    { loc: "/archive", lastmod: latestPostDate, priority: "0.7", changefreq: "weekly" },
    { loc: "/start", priority: "0.6", changefreq: "monthly" },
    { loc: "/feeds", priority: "0.4", changefreq: "monthly" },
    { loc: "/newsletter", priority: "0.4", changefreq: "monthly" },
  ];

  const categoryRoutes: SitemapRoute[] = categories.map((c) => {
    const latest = getPostsByCategory(c.slug as CategorySlug)[0];
    return {
      loc: `/category/${c.slug}`,
      lastmod: isoDate(latest?.updatedAt ?? latest?.publishedAt),
      priority: "0.7",
      changefreq: "weekly",
    };
  });

  const postRoutes: SitemapRoute[] = posts.map((post) => ({
    loc: post.url,
    lastmod: isoDate(post.updatedAt ?? post.publishedAt),
    priority: post.featured ? "0.9" : "0.8",
    changefreq: "monthly",
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes];

  const entries = allRoutes
    .map((route) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(`${siteUrl}${route.loc}`)}</loc>`];
      if (route.lastmod) lines.push(`    <lastmod>${route.lastmod}</lastmod>`);
      lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
      lines.push(`    <priority>${route.priority}</priority>`);
      lines.push(`  </url>`);
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}
