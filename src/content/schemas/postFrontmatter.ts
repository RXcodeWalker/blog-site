import { z } from "zod";

export const CategorySlugSchema = z.enum([
  "football",
  "mindset",
  "learning",
  "building",
  "journal",
]);

export const PostTagSchema = z.enum(["Articles", "Notes", "Series"]);

/**
 * Zod schema for MDX frontmatter.
 * publishedAt must be ISO format: YYYY-MM-DD
 * All optional fields have sane defaults so authors only write what they need.
 */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z.string().optional(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "publishedAt must be YYYY-MM-DD"),
  updatedAt: z.string().optional(),
  category: CategorySlugSchema,
  tags: z.array(PostTagSchema).default([]),
  featured: z.boolean().default(false),
  excerpt: z.string().optional(),
  author: z.string().default("Om Jhamvar"),
  related: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  series: z
    .object({
      name: z.string().min(1, "series.name is required"),
      order: z.number().int().nonnegative("series.order must be a non-negative integer"),
    })
    .optional(),
});

export type PostFrontmatterInput = z.input<typeof postFrontmatterSchema>;
export type PostFrontmatterOutput = z.output<typeof postFrontmatterSchema>;
