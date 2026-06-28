import { Link } from "@tanstack/react-router";
import type { PostMeta } from "@/content/api.ts";

interface ArchivePostRowProps {
  post: PostMeta;
  showCategory?: boolean;
}

export function ArchivePostRow({ post, showCategory = true }: ArchivePostRowProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <li className="group">
      <Link
        to="/article/$slug"
        params={{ slug: post.slug }}
        className="flex flex-col gap-1 py-3 transition-colors hover:text-foreground md:flex-row md:items-baseline md:gap-6"
      >
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:w-28">
          {date}
        </span>
        {showCategory && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-electric md:w-24">
            {post.category}
          </span>
        )}
        <span className="flex-1 font-serif text-base leading-snug transition-colors group-hover:text-gold">
          {post.title}
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {post.tags[0]}
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:w-14 md:text-right">
          {post.readingTimeMinutes} min
        </span>
      </Link>
    </li>
  );
}
