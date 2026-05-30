import type { ComponentType } from 'react';

export type CategorySlug = 'football' | 'mindset' | 'learning' | 'building' | 'journal';

export type PostTag = 'Essay' | 'Analysis' | 'Signal' | 'Note' | 'Series';

/** Normalized, validated metadata for a single post — safe to pass to any component or route. */
export interface PostMeta {
  slug: string;
  title: string;
  publishedAt: string;
  updatedAt: string | null;
  category: CategorySlug;
  tags: PostTag[];
  featured: boolean;
  excerpt: string;
  cover: string;
  author: string;
  related: string[];
  draft: boolean;
  readingTimeMinutes: number;
  wordCount: number;
  url: string;
}

/** Full post record: metadata + the compiled React component for the body. */
export interface PostRecord extends PostMeta {
  Content: ComponentType<{ components?: Record<string, ComponentType>; [k: string]: unknown }>;
}

/** Category definition including display metadata and derived counts. */
export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  accent: string;
  desc: string;
  defaultCover: string;
}

export interface CategoryWithCount extends CategoryMeta {
  count: number;
}

/** Shape of the raw MDX module as resolved by Vite + @mdx-js/rollup. */
export interface MdxModule {
  default: ComponentType<{ components?: Record<string, ComponentType>; [k: string]: unknown }>;
  frontmatter: Record<string, unknown>;
}
