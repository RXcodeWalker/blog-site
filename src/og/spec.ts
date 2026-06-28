import { createHash } from "node:crypto";
import type { CategorySlug } from "@/content/types";

export type OgSpec =
  | {
      type: "post";
      slug: string;
      title: string;
      excerpt: string;
      category: CategorySlug;
      readingTimeMinutes: number;
      author: string;
    }
  | {
      type: "category";
      slug: string;
      name: string;
      tagline: string;
      category: CategorySlug;
    }
  | { type: "home" }
  | { type: "default" };

export function metadataHash(spec: OgSpec): string {
  const stable = JSON.stringify(spec, Object.keys(spec).sort());
  return createHash("sha1").update(stable).digest("hex").slice(0, 8);
}
