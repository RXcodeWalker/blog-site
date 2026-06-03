/**
 * Search document serializer.
 *
 * Produces a lean, search-indexable representation of all posts.
 * Future use: feed this into Fuse.js, Pagefind, Orama, or any other
 * client/server search engine without modifying the content layer.
 *
 * Usage:
 *   const docs = getSearchDocuments();
 *   // or, for JSON export at build time, see scripts/generate-search-index.ts
 */
import { getAllPosts } from "../api";

export interface SearchDocument {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  url: string;
}

let _cache: SearchDocument[] | null = null;

/** Returns all posts as flat, search-friendly documents (cached after first call). */
export function getSearchDocuments(): SearchDocument[] {
  if (_cache) return _cache;
  _cache = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    url: post.url,
  }));
  return _cache;
}
