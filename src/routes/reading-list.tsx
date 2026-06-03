import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { getPostBySlug } from "@/content/api.ts";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArrowUpRight, Bookmark, X } from "lucide-react";

export const Route = createFileRoute("/reading-list")({
  head: () => ({
    meta: [
      { title: "Reading list — Beyond the Basics" },
      { name: "description", content: "Essays you've saved to read later." },
    ],
  }),
  component: ReadingList,
});

function ReadingList() {
  const { bookmarks, remove } = useBookmarks();
  // Resolve slugs to posts, dropping any that no longer exist.
  const posts = bookmarks
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-24 lg:pt-32">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — Saved for later
        </div>
        <h1 className="mt-3 font-serif text-5xl font-light tracking-tight md:text-6xl">
          Reading list
        </h1>

        {posts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center rounded-lg border border-dashed border-border py-20 text-center">
            <Bookmark className="h-7 w-7 text-muted-foreground" />
            <p className="mt-5 max-w-sm font-serif text-xl text-muted-foreground">
              Nothing saved yet. Tap the bookmark on any essay to keep it here.
            </p>
            <Link
              to="/"
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] underline-grow"
            >
              Browse the index →
            </Link>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {posts.map((post) => {
              const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <li key={post.slug} className="group flex items-center gap-4 py-6">
                  <Link to="/article/$slug" params={{ slug: post.slug }} className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                      {post.category}
                    </div>
                    <h2 className="mt-1 truncate font-serif text-2xl leading-tight transition-colors group-hover:text-gold">
                      {post.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{date}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>{post.readingTimeMinutes} min</span>
                    </div>
                  </Link>
                  <Link
                    to="/article/$slug"
                    params={{ slug: post.slug }}
                    aria-label={`Read ${post.title}`}
                    className="hidden shrink-0 text-muted-foreground transition-colors group-hover:text-foreground sm:block"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(post.slug)}
                    aria-label={`Remove ${post.title} from reading list`}
                    className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
