/**
 * RSS feed generator.
 *
 * Produces a valid RSS 2.0 XML string from the post manifest.
 * Wire this to a TanStack Start server function or API route when ready:
 *
 *   export const Route = createFileRoute('/rss.xml')({
 *     loader: () => generateRssFeed({ siteUrl: 'https://beyondthebasics.me' }),
 *   });
 *
 * Or call generateRssFeed() from a build script and write the output
 * to the /public folder for static serving.
 */
import { getAllPosts } from '../api';

interface RssFeedOptions {
  siteUrl: string;
  title?: string;
  description?: string;
  language?: string;
  limit?: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateRssFeed(options: RssFeedOptions): string {
  const {
    siteUrl,
    title = 'Beyond the Basics — Om Jhamvar',
    description = 'Football tactics, coding journeys, and growth notes from Om Jhamvar.',
    language = 'en-US',
    limit = 20,
  } = options;

  const posts = getAllPosts().slice(0, limit);
  const lastBuildDate = posts[0]
    ? new Date(posts[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.publishedAt).toUTCString();
      const link = `${siteUrl}${post.url}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`.trim();
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
