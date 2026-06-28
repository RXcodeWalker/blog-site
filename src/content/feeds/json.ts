import { getAllPosts } from "../api";
import type { PostRecord } from "../types";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "./constants";

interface JsonFeedOptions {
  siteUrl?: string;
  title?: string;
  description?: string;
  feedUrl?: string;
  limit?: number;
  posts?: readonly PostRecord[];
}

export function generateJsonFeed(options: JsonFeedOptions = {}): string {
  const {
    siteUrl = SITE_URL,
    title = SITE_TITLE,
    description = SITE_DESCRIPTION,
    feedUrl = `${SITE_URL}/feed.json`,
    limit = 20,
    posts,
  } = options;

  const resolvedPosts = (posts ?? getAllPosts()).slice(0, limit);

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title,
    description,
    home_page_url: siteUrl,
    feed_url: feedUrl,
    favicon: `${siteUrl}/favicon.ico`,
    authors: [{ name: "Om Jhamvar", url: siteUrl }],
    language: "en-US",
    items: resolvedPosts.map((post) => ({
      id: `${siteUrl}${post.url}`,
      url: `${siteUrl}${post.url}`,
      title: post.title,
      content_text: post.excerpt,
      date_published: new Date(post.publishedAt).toISOString(),
      date_modified: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : new Date(post.publishedAt).toISOString(),
      tags: [post.category, ...post.tags],
      authors: [{ name: post.author }],
    })),
  };

  return JSON.stringify(feed, null, 2);
}
