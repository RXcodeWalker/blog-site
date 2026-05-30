import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import {
  getPostsByCategory,
  getCategoryWithCount,
  getAllCategoriesWithCounts,
} from "@/content/api.ts";
import type { CategorySlug } from "@/content/api.ts";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategoryWithCount(params.slug);
    if (!category) throw notFound();
    const posts = getPostsByCategory(category.slug as CategorySlug);
    return { category, posts };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Beyond the Basics` },
          { name: "description", content: loaderData.category.desc },
          { property: "og:title", content: `${loaderData.category.name} — Beyond the Basics` },
          { property: "og:description", content: loaderData.category.desc },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-serif text-5xl">Section not found</h1>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">{error.message}</div>
    </SiteShell>
  ),
  component: Category,
});

type SortOption =
  | "recency-desc"
  | "recency-asc"
  | "title-asc"
  | "title-desc"
  | "length-desc"
  | "length-asc";

function Category() {
  const { category: c, posts: allPosts } = Route.useLoaderData();
  const allCategories = getAllCategoriesWithCounts();
  const categoryIndex = allCategories.findIndex((cat) => cat.slug === c.slug);

  const [tagFilter, setTagFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState<SortOption>("recency-desc");

  const filteredItems = useMemo(() => {
    const base =
      tagFilter === "All"
        ? allPosts
        : allPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase()));

    return [...base].sort((a, b) => {
      if (sortFilter === "title-asc") return a.title.localeCompare(b.title);
      if (sortFilter === "title-desc") return b.title.localeCompare(a.title);
      if (sortFilter === "length-desc") return b.readingTimeMinutes - a.readingTimeMinutes;
      if (sortFilter === "length-asc") return a.readingTimeMinutes - b.readingTimeMinutes;
      if (sortFilter === "recency-asc")
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [allPosts, sortFilter, tagFilter]);

  const sortLabels: Record<SortOption, string> = {
    "recency-desc": "Most Recent",
    "recency-asc": "Oldest First",
    "title-asc": "Title (A-Z)",
    "title-desc": "Title (Z-A)",
    "length-desc": "Longest Read",
    "length-asc": "Shortest Read",
  };

  return (
    <SiteShell>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top left, oklch(0.6 0.18 ${c.accent.split(" ")[0]} / 0.5), transparent 60%)`,
          }}
        />
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Index
            </Link>
            <span>/</span>
            <span className="text-foreground">Section</span>
            <span>/</span>
            <span className="text-gold">{c.name}</span>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
                — Section {String(categoryIndex + 1).padStart(2, "0")}
              </div>
              <h1 className="mt-6 font-serif text-[clamp(3rem,10vw,9rem)] font-light leading-[0.9] tracking-[-0.03em] text-balance">
                {c.name}
              </h1>
            </div>
            <div className="md:col-span-4 md:pt-12">
              <p className="font-serif text-xl italic leading-relaxed text-muted-foreground text-pretty">
                {c.desc}
              </p>
              <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.count} {c.count === 1 ? "entry" : "entries"} · Updated regularly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-6 py-4 lg:px-12 font-mono text-[11px] uppercase tracking-[0.18em]">
          {["All", "Essay", "Analysis", "Signal", "Note", "Series"].map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 transition-colors ${
                tagFilter === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto gap-2 rounded-full border-border px-4 text-[11px] uppercase tracking-[0.18em]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter: {sortLabels[sortFilter]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSortFilter("recency-desc")}>
                Recency: newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter("recency-asc")}>
                Recency: oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter("title-asc")}>
                Title: A to Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter("title-desc")}>
                Title: Z to A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter("length-desc")}>
                Length: longest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortFilter("length-asc")}>
                Length: shortest first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* List */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
        {filteredItems.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            No posts in this filter yet.
          </p>
        ) : (
          <ol className="divide-y divide-border">
            {filteredItems.map((post, i) => {
              const displayDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <li key={post.slug}>
                  <Link
                    to="/article/$slug"
                    params={{ slug: post.slug }}
                    className="group grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="md:col-span-7">
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                        {post.tags[0]} · {displayDate}
                      </div>
                      <h3 className="mt-2 font-serif text-3xl font-light leading-tight tracking-tight transition-colors group-hover:text-gold md:text-4xl">
                        {post.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden md:col-span-3">
                      <img
                        src={post.cover}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-start justify-end md:col-span-1">
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </SiteShell>
  );
}
