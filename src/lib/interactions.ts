import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Anonymous Interaction Service
 *
 * NOTE: This uses an in-memory store. In a production environment,
 * replace the `STORE` with a database (e.g., Vercel KV, Supabase, Postgres).
 */

export interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface Interactions {
  likes: number;
  comments: Comment[];
}

// Simple in-memory store: Map<slug, Interactions>
const STORE = new Map<string, Interactions>();

function getOrInit(slug: string): Interactions {
  if (!STORE.has(slug)) {
    STORE.set(slug, { likes: 0, comments: [] });
  }
  return STORE.get(slug)!;
}

/** Fetch all likes and comments for a post. */
export const getInteractions = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return getOrInit(slug);
  });

/** Add a like to a post. */
export const addLike = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const interactions = getOrInit(slug);
    interactions.likes += 1;
    return interactions.likes;
  });

/** Add a comment to a post. */
export const addComment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      slug: z.string(),
      name: z.string().optional(),
      text: z.string().min(1, "Comment cannot be empty"),
      honeypot: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    // If honeypot is filled, it's likely a bot. Silently ignore or throw.
    if (data.honeypot) {
      return { success: false, error: "Spam detected" };
    }

    const interactions = getOrInit(data.slug);
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name?.trim() || "Anonymous",
      text: data.text.trim(),
      createdAt: new Date().toISOString(),
    };

    interactions.comments.unshift(newComment); // Newest first
    return { success: true, comment: newComment };
  });
