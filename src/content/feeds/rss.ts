import { getAllPosts } from "../api";
import type { PostRecord } from "../types";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "./constants";

interface RssFeedOptions {
  siteUrl?: string;
  title?: string;
  description?: string;
  language?: string;
  limit?: number;
  posts?: readonly PostRecord[];
  selfUrl?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssFeed(options: RssFeedOptions = {}): string {
  const {
    siteUrl = SITE_URL,
    title = SITE_TITLE,
    description = SITE_DESCRIPTION,
    language = "en-US",
    limit = 20,
    posts,
    selfUrl,
  } = options;

  const resolvedPosts = (posts ?? getAllPosts()).slice(0, limit);
  const lastBuildDate = new Date().toUTCString();
  const atomSelf = selfUrl ?? `${siteUrl}/rss.xml`;

  const items = resolvedPosts
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
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`.trim();
    })
    .join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>60</ttl>
    <generator>Beyond the Basics</generator>
    <atom:link href="${escapeXml(atomSelf)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
