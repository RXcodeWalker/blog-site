/**
 * postIndexes — derived lookup indexes built once from POST_MANIFEST.
 *
 * All indexes are built at module-init time (build time / process start)
 * so every route loader does an O(1) map lookup, never an array scan.
 */
import { POST_MANIFEST } from "./postManifest";
import type { CategorySlug, CategoryWithCount, PostRecord } from "../types";
import { CATEGORIES, CATEGORY_SLUGS } from "../taxonomy/categories";

// ---------------------------------------------------------------------------
// Index maps
// ---------------------------------------------------------------------------

/** O(1) lookup by slug. */
export const BY_SLUG: ReadonlyMap<string, PostRecord> = new Map(
  POST_MANIFEST.map((p) => [p.slug, p]),
);

/** O(1) lookup by category slug → sorted posts. */
export const BY_CATEGORY: ReadonlyMap<CategorySlug, PostRecord[]> = new Map(
  CATEGORY_SLUGS.map((cat) => [cat, POST_MANIFEST.filter((p) => p.category === cat)]),
);

/** O(1) lookup by tag → posts with that tag. */
export const BY_TAG: ReadonlyMap<string, PostRecord[]> = (() => {
  const map = new Map<string, PostRecord[]>();
  for (const post of POST_MANIFEST) {
    for (const tag of post.tags) {
      const existing = map.get(tag) ?? [];
      existing.push(post);
      map.set(tag, existing);
    }
  }
  return map;
})();

/** Featured posts list (featured: true in frontmatter), newest-first. */
export const FEATURED_POSTS: readonly PostRecord[] = POST_MANIFEST.filter((p) => p.featured);

/** Categories enriched with live post counts derived from the manifest. */
export const CATEGORIES_WITH_COUNTS: readonly CategoryWithCount[] = CATEGORY_SLUGS.map((slug) => ({
  ...CATEGORIES[slug],
  count: BY_CATEGORY.get(slug)?.length ?? 0,
}));
