import type { CSSProperties } from "react";
import {
  Brain,
  Code2,
  GraduationCap,
  NotebookPen,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/content/types";

export type CoverPattern = "pitch" | "orbits" | "grid" | "nodes" | "journal";

export interface CategoryStyle {
  slug: CategorySlug;
  cssVar: string;
  icon: LucideIcon;
  pattern: CoverPattern;
}

export const CATEGORY_STYLE: Record<CategorySlug, CategoryStyle> = {
  football: {
    slug: "football",
    cssVar: "var(--cat-football)",
    icon: Trophy,
    pattern: "pitch",
  },
  mindset: {
    slug: "mindset",
    cssVar: "var(--cat-mindset)",
    icon: Brain,
    pattern: "orbits",
  },
  learning: {
    slug: "learning",
    cssVar: "var(--cat-learning)",
    icon: GraduationCap,
    pattern: "grid",
  },
  building: {
    slug: "building",
    cssVar: "var(--cat-building)",
    icon: Code2,
    pattern: "nodes",
  },
  journal: {
    slug: "journal",
    cssVar: "var(--cat-journal)",
    icon: NotebookPen,
    pattern: "journal",
  },
};

export function getCategoryStyle(slug: string): CategoryStyle {
  return CATEGORY_STYLE[slug as CategorySlug] ?? CATEGORY_STYLE.journal;
}

export function categoryCssVars(slug: string): CSSProperties {
  return { "--cat": getCategoryStyle(slug).cssVar } as CSSProperties;
}
