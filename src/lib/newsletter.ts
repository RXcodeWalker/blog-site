import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BUTTONDOWN_BASE = "https://api.buttondown.email/v1";

export interface SubscribeInput {
  email: string;
  source: "article" | "footer" | "newsletter_page";
  honeypot?: string;
}

export interface SubscribeResult {
  ok: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}

export interface ArchiveIssue {
  id: string;
  subject: string;
  description: string;
  publishedAt: string;
  slug: string;
  subscribersCount: number;
  buttondownArchiveUrl: string;
}

interface ButtondownEmail {
  id: string;
  creation_date: string;
  publish_date: string | null;
  subject: string;
  body: string;
  description: string;
  slug: string;
  status: "sent" | "draft" | "scheduled";
  email_type: "public" | "premium" | "private";
  subscribers_count: number;
}

interface ButtondownListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function getApiKey() {
  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) throw new Error("BUTTONDOWN_API_KEY not set");
  return key;
}

async function buttondownFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BUTTONDOWN_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Token ${getApiKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw Object.assign(new Error(`Buttondown ${res.status}`), { status: res.status });
  }
  return res.json() as Promise<T>;
}

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.enum(["article", "footer", "newsletter_page"]),
  honeypot: z.string().optional(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator(subscribeSchema)
  .handler(async ({ data }): Promise<SubscribeResult> => {
    if (data.honeypot) return { ok: true };
    try {
      await buttondownFetch("/subscribers", {
        method: "POST",
        body: JSON.stringify({ email: data.email, tags: [`source:${data.source}`] }),
      });
      return { ok: true };
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e.status === 400) return { ok: false, alreadySubscribed: true };
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  });

export const getNewsletterArchive = createServerFn({ method: "GET" }).handler(
  async (): Promise<ArchiveIssue[]> => {
    const data = await buttondownFetch<ButtondownListResponse<ButtondownEmail>>(
      "/emails?status=sent&email_type=public",
    );
    return data.results.map((e) => ({
      id: e.id,
      subject: e.subject,
      description: e.description,
      publishedAt: e.publish_date ?? e.creation_date,
      slug: e.slug,
      subscribersCount: e.subscribers_count,
      buttondownArchiveUrl: `https://buttondown.com/beyondthebasics/archive/${e.slug}`,
    }));
  },
);
