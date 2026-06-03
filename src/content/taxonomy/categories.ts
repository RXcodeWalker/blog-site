import footballImg from "@/assets/feature-football.jpg";
import techImg from "@/assets/feature-tech.jpg";
import philoImg from "@/assets/feature-philosophy.jpg";
import readingImg from "@/assets/feature-reading.jpg";
import type { CategoryMeta, CategorySlug } from "../types";

export const CATEGORY_SLUGS = [
  "football",
  "mindset",
  "learning",
  "building",
  "journal",
] as const satisfies CategorySlug[];

export const CATEGORIES: Record<CategorySlug, CategoryMeta> = {
  football: {
    slug: "football",
    name: "Football",
    accent: "75 12%",
    desc: "Arsenal match reviews, tactical breakdowns, transfer takes, and fan-first analysis.",
    defaultCover: footballImg,
  },
  mindset: {
    slug: "mindset",
    name: "Mindset",
    accent: "245 18%",
    desc: "Personal growth, leadership notes, mental models, and learning in public.",
    defaultCover: readingImg,
  },
  learning: {
    slug: "learning",
    name: "Learning",
    accent: "180 14%",
    desc: "Academic projects, research notes, and what I'm studying right now.",
    defaultCover: techImg,
  },
  building: {
    slug: "building",
    name: "Building",
    accent: "150 14%",
    desc: "Coding projects, web experiments, and what I'm shipping in public.",
    defaultCover: techImg,
  },
  journal: {
    slug: "journal",
    name: "Journal",
    accent: "30 12%",
    desc: "Personal reflections, weekly notes, and thoughts in motion.",
    defaultCover: philoImg,
  },
};

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  if (CATEGORY_SLUGS.includes(slug as CategorySlug)) {
    return CATEGORIES[slug as CategorySlug];
  }
  return undefined;
}
