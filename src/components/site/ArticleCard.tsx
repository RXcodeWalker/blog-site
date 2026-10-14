import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryCssVars } from "@/lib/categoryStyle";
import { PostCover } from "@/components/site/PostCover";
import { CategoryBadge } from "@/components/site/CategoryBadge";
import type { PostMeta } from "@/content/api.ts";

interface ArticleCardProps {
  post: PostMeta;
  variant?: "default" | "wide";
  className?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArticleCard({ post, variant = "default", className }: ArticleCardProps) {
  const wide = variant === "wide";

  return (
    <Link
      to="/article/$slug"
      params={{ slug: post.slug }}
      style={categoryCssVars(post.category)}
      className={cn(
        "group surface-card gradient-border sheen flex overflow-hidden rounded-xl border border-border/80 transition-transform duration-500 hover:-translate-y-1",
        wide ? "flex-col md:flex-row md:col-span-2" : "flex-col",
        className,
      )}
    >
      <div className={cn("relative shrink-0", wide ? "aspect-[16/10] md:aspect-auto md:w-[46%]" : "aspect-[16/10]")}>
        <PostCover slug={post.slug} category={post.category} className="absolute inset-0 h-full w-full" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge slug={post.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3
          className={cn(
            "font-serif font-light leading-tight tracking-tight transition-colors group-hover:text-[var(--cat)]",
            wide ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-mono text-[9px] font-medium tracking-wide text-gold">
              OJ
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {post.readingTimeMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
