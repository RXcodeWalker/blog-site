import { Link } from "@tanstack/react-router";
import type { PostMeta } from "@/content/api.ts";
import { PostCover } from "@/components/site/PostCover";
import { categoryCssVars } from "@/lib/categoryStyle";

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
    <li className="group" style={categoryCssVars(post.category)}>
      <Link
        to="/article/$slug"
        params={{ slug: post.slug }}
        className="flex items-center gap-4 py-3 transition-colors hover:text-foreground"
      >
        <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border md:block">
          <PostCover slug={post.slug} category={post.category} className="absolute inset-0 h-full w-full" />
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:w-28">
          {date}
        </span>
        {showCategory && (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--cat)] md:w-24">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cat)]" />
            {post.category}
          </span>
        )}
        <span className="flex-1 font-serif text-base leading-snug transition-colors group-hover:text-[var(--cat)]">
          {post.title}
        </span>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
          {post.tags[0]}
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:w-14 md:text-right">
          {post.readingTimeMinutes} min
        </span>
      </Link>
    </li>
  );
}
