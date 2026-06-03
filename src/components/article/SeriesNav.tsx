import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { PostRecord } from "@/content/types";

type Props = {
  /** All posts in the series, ordered by `series.order`. */
  posts: PostRecord[];
  currentSlug: string;
};

/**
 * Compact "Part X of N" series index, shown at the top of an article that belongs to a series.
 * Highlights the current entry and links to the others.
 */
export function SeriesNav({ posts, currentSlug }: Props) {
  if (posts.length < 2) return null;
  const seriesName = posts[0].series?.name ?? "Series";
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);

  return (
    <aside className="mx-auto mb-12 max-w-2xl rounded border border-border bg-secondary/30 p-6">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
          {seriesName}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Part {currentIndex + 1} of {posts.length}
        </span>
      </div>
      <ol className="mt-4 flex flex-col gap-2">
        {posts.map((p, i) => {
          const isCurrent = p.slug === currentSlug;
          return (
            <li key={p.slug} className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
              {isCurrent ? (
                <span className="flex-1 font-serif text-base text-gold">{p.title}</span>
              ) : (
                <Link
                  to="/article/$slug"
                  params={{ slug: p.slug }}
                  className="flex-1 font-serif text-base text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.title}
                </Link>
              )}
              {isCurrent && <Check className="h-3.5 w-3.5 shrink-0 text-gold" />}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
