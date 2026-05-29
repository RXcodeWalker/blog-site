import { useEffect, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { getAllPosts, getAllCategoriesWithCounts } from "@/content/api";
import { Link } from "@tanstack/react-router";

type Props = { open: boolean; onClose: () => void };

const allPosts = getAllPosts();
const allCategories = getAllCategoriesWithCounts();

export function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const term = q.toLowerCase().trim();
  const filtered = term
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)),
      )
    : allPosts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 animate-fade-up" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
      <div
        className="relative mx-auto mt-[10vh] max-w-3xl px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-editorial">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search essays, ideas, or sections…"
              className="flex-1 bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={onClose}
              className="rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {term ? `${filtered.length} results` : "Suggested reading"}
            </div>
            <ul>
              {filtered.map((post) => (
                <li key={post.slug}>
                  <Link
                    to="/article/$slug"
                    params={{ slug: post.slug }}
                    onClick={onClose}
                    className="group flex items-start gap-4 rounded-md p-3 transition-colors hover:bg-secondary"
                  >
                    <div className="flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric">
                        {post.category}
                      </div>
                      <div className="font-serif text-lg leading-tight">{post.title}</div>
                      <div className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {post.excerpt}
                      </div>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>

            {!term && (
              <>
                <div className="px-3 pb-2 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Sections
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {allCategories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      onClick={onClose}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>↑ ↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
