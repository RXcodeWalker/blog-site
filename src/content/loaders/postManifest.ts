/**
 * postManifest — the single build-time discovery and normalization step.
 *
 * One glob runs eagerly at module-init time (i.e. once at build, never per-request):
 *   compiled MDX modules → gives us the React component + frontmatter + rawBody (injected
 *   by the remarkExportRaw plugin in vite.config.ts) for reading-time + excerpt fallback.
 *
 * The output is a readonly array of PostRecord objects sorted newest-first.
 */
/** Words per minute used to estimate reading time. */
const WPM = 200;

function readingTime(text: string): { minutes: number; words: number } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { minutes: words / WPM, words };
}
import { postFrontmatterSchema } from "../schemas/postFrontmatter";
import { CATEGORIES, CATEGORY_SLUGS } from "../taxonomy/categories";
import { runIntegrityChecks } from "../integrity";
import type { MdxModule, PostRecord, CategorySlug, TocHeading } from "../types";

// ---------------------------------------------------------------------------
// Vite globs — must be literals; cannot be dynamic.
// ---------------------------------------------------------------------------

const mdxModules = import.meta.glob<MdxModule>("../posts/**/*.mdx", {
  eager: true,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive a slug from a Vite glob key like '../../content/posts/2026/my-post.mdx' */
function slugFromPath(path: string): string {
  return path
    .split("/")
    .pop()!
    .replace(/\.mdx$/, "");
}

/** Extract first non-empty paragraph as an excerpt fallback. */
function extractExcerpt(body: string): string {
  const lines = body.split("\n");
  for (const line of lines) {
    const stripped = line.trim();
    // Skip headings, blank lines, and MDX import/export statements
    if (
      stripped &&
      !stripped.startsWith("#") &&
      !stripped.startsWith("import") &&
      !stripped.startsWith("export")
    ) {
      // Remove inline markdown: bold, italic, links, code
      return stripped
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\[(.+?)\]\(.+?\)/g, "$1")
        .replace(/`(.+?)`/g, "$1")
        .slice(0, 200);
    }
  }
  return "";
}

/** Parse the JSON heading list injected by the rehypeCollectHeadings build plugin. */
function parseHeadings(json: string | undefined): TocHeading[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as TocHeading[]) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Build manifest
// ---------------------------------------------------------------------------

function buildManifest(): PostRecord[] {
  const isDev = import.meta.env.DEV;
  const records: PostRecord[] = [];

  for (const [path, mod] of Object.entries(mdxModules)) {
    const body = mod.rawBody ?? "";
    const rt = readingTime(body);

    // Validate frontmatter through zod schema — throws in dev, skips in prod.
    const parseResult = postFrontmatterSchema.safeParse(mod.frontmatter ?? {});

    if (!parseResult.success) {
      const msg = `[content] Invalid frontmatter in ${path}:\n${parseResult.error.toString()}`;
      if (isDev) {
        throw new Error(msg);
      }
      console.error(msg);
      continue;
    }

    const fm = parseResult.data;

    // Skip drafts in production
    if (fm.draft && !isDev) continue;

    const pathSlug = slugFromPath(path);
    const slug = fm.slug ?? pathSlug;

    if (!CATEGORY_SLUGS.includes(fm.category as CategorySlug)) {
      console.error(`[content] Unknown category "${fm.category}" in ${path}`);
      continue;
    }

    const category = CATEGORIES[fm.category];
    const excerpt = fm.excerpt ?? extractExcerpt(body);

    records.push({
      slug,
      title: fm.title,
      publishedAt: fm.publishedAt,
      updatedAt: fm.updatedAt ?? null,
      category: fm.category,
      tags: fm.tags,
      featured: fm.featured,
      excerpt,
      cover: category.defaultCover,
      author: fm.author,
      related: fm.related,
      draft: fm.draft,
      readingTimeMinutes: Math.ceil(rt.minutes) || 1,
      wordCount: rt.words,
      url: `/article/${slug}`,
      headings: parseHeadings(mod.headingsJson),
      series: fm.series ?? null,
      Content: mod.default,
    });
  }

  // Sort newest-first — done once here, never in components.
  const sorted = records.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Run integrity checks in development to surface authoring issues early.
  if (isDev) {
    runIntegrityChecks(sorted);
  }

  return sorted;
}

/**
 * Immutable manifest of all (non-draft in prod) posts, sorted newest-first.
 * Module-level constant — computed once per process/bundle.
 */
export const POST_MANIFEST: readonly PostRecord[] = buildManifest();
