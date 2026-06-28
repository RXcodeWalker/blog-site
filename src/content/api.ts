/**
 * Content API — the only surface routes and components should import.
 *
 * Wraps the raw indexes behind typed, documented functions.
 * Keep all callers decoupled from internal loader mechanics.
 */
import {
  BY_SLUG,
  BY_CATEGORY,
  BY_TAG,
  FEATURED_POSTS,
  CATEGORIES_WITH_COUNTS,
} from "./loaders/postIndexes";
import { POST_MANIFEST } from "./loaders/postManifest";
import type { CategorySlug, CategoryWithCount, PostMeta, PostRecord } from "./types";

export type { CategorySlug, CategoryWithCount, PostMeta, PostRecord };

// ---------------------------------------------------------------------------
// Post queries
// ---------------------------------------------------------------------------

/** All published posts, newest-first. */
export function getAllPosts(): readonly PostRecord[] {
  return POST_MANIFEST;
}

/** Single post by slug, or undefined if not found. */
export function getPostBySlug(slug: string): PostRecord | undefined {
  return BY_SLUG.get(slug);
}

/** All posts in a category, newest-first. */
export function getPostsByCategory(categorySlug: CategorySlug): PostRecord[] {
  return BY_CATEGORY.get(categorySlug) ?? [];
}

/** All posts with a specific tag, newest-first. */
export function getPostsByTag(tag: string): PostRecord[] {
  return BY_TAG.get(tag) ?? [];
}

/**
 * Featured posts (featured: true).
 * Falls back to the most recent posts if none are marked.
 */
export function getFeaturedPosts(limit = 3): PostRecord[] {
  const featured = FEATURED_POSTS.length > 0 ? [...FEATURED_POSTS] : [...POST_MANIFEST];
  return featured.slice(0, limit);
}

/**
 * Related posts for a given post.
 * Priority: explicit `related` slugs → same category → shared tags → recency.
 */
export function getRelatedPosts(post: PostRecord, limit = 3): PostRecord[] {
  const seen = new Set<string>([post.slug]);
  const result: PostRecord[] = [];

  // 1. Explicit related slugs from frontmatter
  for (const slug of post.related) {
    const p = BY_SLUG.get(slug);
    if (p && !seen.has(p.slug)) {
      seen.add(p.slug);
      result.push(p);
      if (result.length >= limit) return result;
    }
  }

  // 2. Same category
  for (const p of BY_CATEGORY.get(post.category) ?? []) {
    if (!seen.has(p.slug)) {
      seen.add(p.slug);
      result.push(p);
      if (result.length >= limit) return result;
    }
  }

  // 3. Shared tags
  for (const tag of post.tags) {
    for (const p of BY_TAG.get(tag) ?? []) {
      if (!seen.has(p.slug)) {
        seen.add(p.slug);
        result.push(p);
        if (result.length >= limit) return result;
      }
    }
  }

  // 4. Recency fallback
  for (const p of POST_MANIFEST) {
    if (!seen.has(p.slug)) {
      result.push(p);
      if (result.length >= limit) return result;
    }
  }

  return result;
}

/**
 * The chronologically adjacent posts around `post` in the full manifest (newest-first).
 * `prev` is the newer post, `next` is the older one — i.e. the natural "keep reading" direction.
 */
export function getAdjacentPosts(post: PostRecord): {
  prev: PostRecord | null;
  next: PostRecord | null;
} {
  const i = POST_MANIFEST.findIndex((p) => p.slug === post.slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? POST_MANIFEST[i - 1] : null,
    next: i < POST_MANIFEST.length - 1 ? POST_MANIFEST[i + 1] : null,
  };
}

/**
 * All posts in the same series as `post` (including `post`), ordered by `series.order`.
 * Returns an empty array when the post is not part of a series.
 */
export function getSeriesPosts(post: PostRecord): PostRecord[] {
  if (!post.series) return [];
  const name = post.series.name;
  return POST_MANIFEST.filter((p) => p.series?.name === name).sort(
    (a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0),
  );
}

// ---------------------------------------------------------------------------
// Latest convenience helpers
// ---------------------------------------------------------------------------

/** The single most recent post (hero/featured essay on homepage). */
export function getLatestPost(): PostRecord | undefined {
  return POST_MANIFEST[0];
}

/** N most recent posts, optionally skipping the first one. */
export function getLatestPosts(limit: number, skip = 0): PostRecord[] {
  return POST_MANIFEST.slice(skip, skip + limit);
}

// ---------------------------------------------------------------------------
// Category queries
// ---------------------------------------------------------------------------

/** All categories with live post counts. */
export function getAllCategoriesWithCounts(): readonly CategoryWithCount[] {
  return CATEGORIES_WITH_COUNTS;
}

/** Single category (with count) by slug, or undefined. */
export function getCategoryWithCount(slug: string): CategoryWithCount | undefined {
  return CATEGORIES_WITH_COUNTS.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Archive helpers
// ---------------------------------------------------------------------------

/** Unique years present in the manifest, newest-first. */
export function getPostYears(): number[] {
  const years = new Set<number>();
  for (const p of POST_MANIFEST) {
    years.add(new Date(p.publishedAt).getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}
