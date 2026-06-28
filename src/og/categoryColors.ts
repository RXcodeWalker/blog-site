import type { CategorySlug } from "@/content/types";

export interface CategoryColors {
  accent: string;
  accentDim: string;
}

export const CATEGORY_COLORS: Record<CategorySlug, CategoryColors> = {
  football: { accent: "#b5b89a", accentDim: "#7a7c68" },
  mindset: { accent: "#8891c4", accentDim: "#5c6491" },
  learning: { accent: "#89b5b5", accentDim: "#5c8888" },
  building: { accent: "#89b5a0", accentDim: "#5c8873" },
  journal: { accent: "#b5a689", accentDim: "#7a7058" },
};

export function getCategoryColors(slug: string): CategoryColors {
  return CATEGORY_COLORS[slug as CategorySlug] ?? { accent: "#8891c4", accentDim: "#5c6491" };
}
