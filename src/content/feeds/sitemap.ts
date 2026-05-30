/**
 * Sitemap generator.
 *
 * Produces a valid XML sitemap from the post manifest + static routes.
 * Wire to a TanStack Start server function at /sitemap.xml:
 *
 *   export const Route = createFileRoute('/sitemap.xml')({
 *     loader: () => generateSitemap({ siteUrl: 'https://beyondthebasics.me' }),
 *   });
 */
import { getAllPosts, getAllCategoriesWithCounts } from '../api';

interface SitemapOptions {
  siteUrl: string;
}

export function generateSitemap({ siteUrl }: SitemapOptions): string {
  const posts = getAllPosts();
  const categories = getAllCategoriesWithCounts();

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
  ];

  const categoryRoutes = categories.map((c) => ({
    loc: `/category/${c.slug}`,
    priority: '0.7',
    changefreq: 'weekly' as const,
  }));

  const postRoutes = posts.map((post) => ({
    loc: post.url,
    lastmod: (post.updatedAt ?? post.publishedAt).slice(0, 10),
    priority: post.featured ? '0.9' : '0.8',
    changefreq: 'monthly' as const,
  }));

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes];

  const entries = allRoutes
    .map((route) => {
      const lines = [`  <url>`, `    <loc>${siteUrl}${route.loc}</loc>`];
      if ('lastmod' in route && route.lastmod) lines.push(`    <lastmod>${route.lastmod}</lastmod>`);
      lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
      lines.push(`    <priority>${route.priority}</priority>`);
      lines.push(`  </url>`);
      return lines.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}
