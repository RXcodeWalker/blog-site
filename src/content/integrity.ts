/**
 * Content integrity checks.
 *
 * Run these at build time or in dev startup to catch common authoring mistakes
 * before they surface as runtime errors or silent bad data.
 *
 * Usage (dev only — called automatically in postManifest during DEV builds):
 *   import { runIntegrityChecks } from '@/content/integrity';
 *   runIntegrityChecks(POST_MANIFEST);
 */
import type { PostRecord } from './types';

interface IntegrityViolation {
  slug: string;
  rule: string;
  detail: string;
}

export function runIntegrityChecks(posts: readonly PostRecord[]): void {
  const violations: IntegrityViolation[] = [];
  const slugsSeen = new Map<string, string>();

  for (const post of posts) {
    // Duplicate slug detection
    if (slugsSeen.has(post.slug)) {
      violations.push({
        slug: post.slug,
        rule: 'DUPLICATE_SLUG',
        detail: `Slug "${post.slug}" already used by another post.`,
      });
    }
    slugsSeen.set(post.slug, post.slug);

    // ISO date validation
    const date = new Date(post.publishedAt);
    if (isNaN(date.getTime())) {
      violations.push({
        slug: post.slug,
        rule: 'INVALID_DATE',
        detail: `publishedAt "${post.publishedAt}" is not a valid ISO date.`,
      });
    }

    // Future date warning
    if (date > new Date()) {
      violations.push({
        slug: post.slug,
        rule: 'FUTURE_DATE',
        detail: `publishedAt "${post.publishedAt}" is in the future. Was this intentional?`,
      });
    }

    // Missing excerpt
    if (!post.excerpt) {
      violations.push({
        slug: post.slug,
        rule: 'MISSING_EXCERPT',
        detail: 'No excerpt found. Add one in frontmatter or write a non-heading first paragraph.',
      });
    }

    // Dangling related slugs
    const allSlugs = new Set(posts.map((p) => p.slug));
    for (const relatedSlug of post.related) {
      if (!allSlugs.has(relatedSlug)) {
        violations.push({
          slug: post.slug,
          rule: 'DANGLING_RELATED',
          detail: `related slug "${relatedSlug}" does not match any existing post.`,
        });
      }
    }

    // Empty tags check
    if (post.tags.length === 0) {
      violations.push({
        slug: post.slug,
        rule: 'NO_TAGS',
        detail: 'Post has no tags. At least one tag is recommended.',
      });
    }
  }

  if (violations.length === 0) {
    console.log(`[content] Integrity OK — ${posts.length} posts checked.`);
    return;
  }

  const errors = violations.filter((v) => v.rule !== 'FUTURE_DATE' && v.rule !== 'NO_TAGS');
  const warnings = violations.filter((v) => v.rule === 'FUTURE_DATE' || v.rule === 'NO_TAGS');

  for (const w of warnings) {
    console.warn(`[content] WARN [${w.rule}] ${w.slug}: ${w.detail}`);
  }

  if (errors.length > 0) {
    const lines = errors.map((e) => `  [${e.rule}] ${e.slug}: ${e.detail}`).join('\n');
    throw new Error(`[content] Content integrity check failed:\n${lines}`);
  }
}
