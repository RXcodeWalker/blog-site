import type { Plugin } from "vite";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import matter from "gray-matter";

// Lazy imports — resolved only in closeBundle (Node build context)
async function getRenderOgImage() {
  const mod = await import("./src/og/renderOgImage");
  return mod.renderOgImage;
}
async function getMetadataHash() {
  const mod = await import("./src/og/spec");
  return mod.metadataHash;
}
async function getSpec() {
  const mod = await import("./src/og/spec");
  return mod;
}

import type { OgSpec } from "./src/og/spec";
import type { CategorySlug } from "./src/content/types";

const CATEGORY_SLUGS = ["football", "mindset", "learning", "building", "journal"] as const;

const CATEGORY_TAGLINES: Record<string, string> = {
  football: "Arsenal match reviews, tactical breakdowns, transfer takes, and fan-first analysis.",
  mindset: "Personal growth, leadership notes, mental models, and learning in public.",
  learning: "Academic projects, research notes, and what I'm studying right now.",
  building: "Coding projects, web experiments, and what I'm shipping in public.",
  journal: "Personal reflections, weekly notes, and thoughts in motion.",
};

function slugify(filePath: string): string {
  const base = filePath.replace(/\\/g, "/").split("/").pop()!;
  return base.replace(/\.mdx?$/, "");
}

function findMdxFiles(dir: string, base = ""): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      results.push(...findMdxFiles(full, rel));
    } else if (/\.(md|mdx)$/.test(entry)) {
      results.push(rel);
    }
  }
  return results;
}

async function collectPostSpecs(postsDir: string): Promise<OgSpec[]> {
  const specs: OgSpec[] = [];
  const isProd = process.env.NODE_ENV === "production";

  const files = findMdxFiles(postsDir);

  for (const file of files) {
    const fullPath = join(postsDir, file);
    try {
      const raw = readFileSync(fullPath, "utf-8");
      const { data: fm } = matter(raw);

      if (isProd && fm.draft === true) continue;

      const slug: string = fm.slug ?? slugify(file);
      const category = (fm.category ?? "mindset") as CategorySlug;
      const title: string = fm.title ?? slug;
      const excerpt: string = fm.excerpt ?? "";
      const author: string = fm.author ?? "Om Jhamvar";

      // Rough reading time: strip frontmatter and count words
      const body = raw.replace(/^---[\s\S]*?---\n?/, "");
      const wordCount = body.split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

      specs.push({
        type: "post",
        slug,
        title,
        excerpt,
        category,
        readingTimeMinutes,
        author,
      });
    } catch (err) {
      console.warn(`[og] Could not parse frontmatter for ${file}:`, err);
    }
  }

  return specs;
}

export function ogImagesPlugin(): Plugin {
  return {
    name: "vite-og-images",
    apply: "build",
    async closeBundle() {
      const outDir = resolve(process.cwd(), "dist/client/og");
      const manifestPath = join(outDir, ".manifest.json");
      const postsDir = resolve(process.cwd(), "src/content/posts");

      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      // Load manifest
      let manifest: Record<string, string> = {};
      if (existsSync(manifestPath)) {
        try {
          manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
        } catch {
          manifest = {};
        }
      }

      const renderOgImage = await getRenderOgImage();
      const { metadataHash } = await getSpec();

      // Collect all specs
      const postSpecs = await collectPostSpecs(postsDir);

      const categorySpecs: OgSpec[] = CATEGORY_SLUGS.map((slug) => ({
        type: "category",
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        tagline: CATEGORY_TAGLINES[slug] ?? "",
        category: slug as CategorySlug,
      }));

      const staticSpecs: OgSpec[] = [
        { type: "home" },
        { type: "default" },
      ];

      const allSpecs: Array<{ spec: OgSpec; outPath: string; key: string }> = [];

      for (const spec of postSpecs) {
        allSpecs.push({
          spec,
          outPath: join(outDir, `${(spec as Extract<OgSpec, { type: "post" }>).slug}.png`),
          key: (spec as Extract<OgSpec, { type: "post" }>).slug,
        });
      }

      for (const spec of categorySpecs) {
        const s = spec as Extract<OgSpec, { type: "category" }>;
        allSpecs.push({
          spec,
          outPath: join(outDir, `category--${s.slug}.png`),
          key: `category--${s.slug}`,
        });
      }

      for (const spec of staticSpecs) {
        allSpecs.push({
          spec,
          outPath: join(outDir, `${spec.type}.png`),
          key: spec.type,
        });
      }

      // Incremental: find which specs need rendering
      const toRender = allSpecs.filter(({ spec, outPath, key }) => {
        const hash = metadataHash(spec);
        return manifest[key] !== hash || !existsSync(outPath);
      });

      if (toRender.length === 0) {
        console.log(`[og] 0 images re-rendered (${allSpecs.length} unchanged)`);
        return;
      }

      console.log(`[og] Rendering ${toRender.length} image(s)...`);

      // Batch parallel rendering (5 at a time)
      const BATCH = 5;
      let rendered = 0;

      async function safeRender(spec: OgSpec): Promise<Buffer> {
        try {
          return await renderOgImage(spec);
        } catch (err) {
          console.error(`[og] Failed to render "${(spec as any).title ?? spec.type}":`, err);
          return await renderOgImage({ type: "default" });
        }
      }

      for (let i = 0; i < toRender.length; i += BATCH) {
        const batch = toRender.slice(i, i + BATCH);
        await Promise.all(
          batch.map(async ({ spec, outPath, key }) => {
            const buf = await safeRender(spec);
            writeFileSync(outPath, buf);
            manifest[key] = metadataHash(spec);
            rendered++;
          }),
        );
      }

      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(
        `[og] Done. ${rendered} rendered, ${allSpecs.length - rendered} unchanged.`,
      );
    },
  };
}
