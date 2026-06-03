import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostRecord } from "@/content/types";

type Props = {
  prev: PostRecord | null;
  next: PostRecord | null;
};

/** Foot-of-article navigation to the chronologically adjacent posts. */
export function PrevNextNav({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Adjacent articles"
      className="mx-auto mt-20 grid max-w-2xl gap-4 px-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          to="/article/$slug"
          params={{ slug: prev.slug }}
          className="group rounded border border-border p-5 transition-colors hover:border-foreground/30"
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> Newer
          </span>
          <span className="mt-2 block font-serif text-lg leading-snug group-hover:text-gold">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          to="/article/$slug"
          params={{ slug: next.slug }}
          className="group rounded border border-border p-5 text-right transition-colors hover:border-foreground/30"
        >
          <span className="flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Older <ArrowRight className="h-3 w-3" />
          </span>
          <span className="mt-2 block font-serif text-lg leading-snug group-hover:text-gold">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  );
}
