import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategoryStructuredData } from "@/lib/structured-data";
import { buildHead, jsonLd } from "@/lib/seo";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import {
  getPostsByCategory,
  getCategoryWithCount,
  getAllCategoriesWithCounts,
  toPostMeta,
} from "@/content/api.ts";
import type { CategorySlug } from "@/content/api.ts";
import { SlidersHorizontal } from "lucide-react";
import { ArticleCard } from "@/components/site/ArticleCard";
import { categoryCssVars, getCategoryStyle } from "@/lib/categoryStyle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const categorySearchSchema = z.object({
  tag: z.string().catch("All"),
  sort: z
    .enum(["recency-desc", "recency-asc", "title-asc", "title-desc", "length-desc", "length-asc"])
    .catch("recency-desc"),
  readTime: z.enum(["any", "short", "medium", "long"]).catch("any"),
});

export const Route = createFileRoute("/category/$slug")({
  validateSearch: categorySearchSchema,
  loader: ({ params }) => {
    const category = getCategoryWithCount(params.slug);
    if (!category) throw notFound();
    const posts = getPostsByCategory(category.slug as CategorySlug).map(toPostMeta);
    return { category, posts };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { category } = loaderData;
    const head = buildHead({
      title: category.name,
      description: category.desc,
      path: `/category/${category.slug}`,
      image: `/og/category--${category.slug}.png`,
      imageAlt: `${category.name} — Beyond the Basics`,
    });
    return {
      ...head,
      scripts: jsonLd(getCategoryStructuredData(category)),
      links: [
        ...head.links,
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: `${category.name} — RSS Feed`,
          href: `/category/${category.slug}/rss.xml`,
        },
      ],
    };
  },
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

type SortOption = z.infer<typeof categorySearchSchema>["sort"];
type ReadTimeOption = z.infer<typeof categorySearchSchema>["readTime"];

function Category() {
  const { category: c, posts: allPosts } = Route.useLoaderData();
  const { tag, sort, readTime } = Route.useSearch();
  const navigate = Route.useNavigate();
  const allCategories = getAllCategoriesWithCounts();
  const categoryIndex = allCategories.findIndex((cat) => cat.slug === c.slug);

  const setTag = (t: string) => navigate({ search: (prev) => ({ ...prev, tag: t }) });
  const setSort = (s: SortOption) => navigate({ search: (prev) => ({ ...prev, sort: s }) });
  const setReadTime = (rt: ReadTimeOption) =>
    navigate({ search: (prev) => ({ ...prev, readTime: rt }) });

  const filteredItems = useMemo(() => {
    let base =
      tag === "All"
        ? allPosts
        : allPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));

    if (readTime !== "any") {
      base = base.filter((p) => {
        if (readTime === "short") return p.readingTimeMinutes < 5;
        if (readTime === "medium") return p.readingTimeMinutes >= 5 && p.readingTimeMinutes <= 10;
        if (readTime === "long") return p.readingTimeMinutes > 10;
        return true;
      });
    }

    return [...base].sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "length-desc") return b.readingTimeMinutes - a.readingTimeMinutes;
      if (sort === "length-asc") return a.readingTimeMinutes - b.readingTimeMinutes;
      if (sort === "recency-asc")
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [allPosts, sort, tag, readTime]);

  const sortLabels: Record<SortOption, string> = {
    "recency-desc": "Most Recent",
    "recency-asc": "Oldest First",
    "title-asc": "Title (A-Z)",
    "title-desc": "Title (Z-A)",
    "length-desc": "Longest Read",
    "length-asc": "Shortest Read",
  };

  const readTimeLabels: Record<ReadTimeOption, string> = {
    any: "Any Length",
    short: "Short (< 5m)",
    medium: "Medium (5-10m)",
    long: "Long (> 10m)",
  };

  const catStyle = getCategoryStyle(c.slug);
  const Icon = catStyle.icon;
  const liveTags = useMemo(() => {
    const tags = new Set<string>();
    for (const post of allPosts) {
      for (const t of post.tags) tags.add(t);
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  }, [allPosts]);
  const showTagFilters = liveTags.length > 1;
  const newestPost = allPosts[0];
  const newestDate = newestPost
    ? new Date(newestPost.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <SiteShell>
      {/* Masthead */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={categoryCssVars(c.slug)}
      >
        <img
          src={c.defaultCover}
          alt=""
          width={1600}
          height={900}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            background: `radial-gradient(ellipse at top left, color-mix(in oklab, var(--cat) 45%, transparent), transparent 60%)`,
          }}
        />
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:pt-20">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Index
            </Link>
            <span>/</span>
            <span className="text-foreground">Section</span>
            <span>/</span>
            <span className="text-[var(--cat)]">{c.name}</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--cat)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--cat)_20%,transparent)]">
                  <Icon className="h-4 w-4" />
                </span>
                — Section {String(categoryIndex + 1).padStart(2, "0")}
              </div>
              <h1 className="mt-4 font-serif text-[clamp(2.5rem,8vw,6rem)] font-light leading-[0.9] tracking-[-0.03em] text-balance">
                {c.name}
              </h1>
            </div>
            <div className="md:col-span-4 md:pt-8">
              <p className="font-serif text-lg italic leading-relaxed text-muted-foreground text-pretty">
                {c.desc}
              </p>
              <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.count} {c.count === 1 ? "entry" : "entries"}
                {newestDate ? ` · Latest ${newestDate}` : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section className="border-b border-border" style={categoryCssVars(c.slug)}>
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-6 py-4 lg:px-12 font-mono text-[11px] uppercase tracking-[0.18em]">
          {showTagFilters &&
            ["All", ...liveTags].map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 transition-colors ${
                  tag === t
                    ? "border-[var(--cat)] bg-[var(--cat)] text-background"
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
                className={`ml-auto gap-2 rounded-full border-border px-4 text-[11px] uppercase tracking-[0.18em] ${
                  sort !== "recency-desc" || readTime !== "any" || tag !== "All"
                    ? "border-foreground bg-secondary"
                    : ""
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter & Sort
                {(sort !== "recency-desc" || readTime !== "any" || tag !== "All") && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-background">
                    {
                      [sort !== "recency-desc", readTime !== "any", tag !== "All"].filter(Boolean)
                        .length
                    }
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Sort By
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                {Object.entries(sortLabels).map(([val, label]) => (
                  <DropdownMenuRadioItem key={val} value={val} className="text-xs uppercase">
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Reading Time
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={readTime}
                onValueChange={(v) => setReadTime(v as ReadTimeOption)}
              >
                {Object.entries(readTimeLabels).map(([val, label]) => (
                  <DropdownMenuRadioItem key={val} value={val} className="text-xs uppercase">
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              {showTagFilters && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tag
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={tag} onValueChange={setTag}>
                    {["All", ...liveTags].map((t) => (
                      <DropdownMenuRadioItem key={t} value={t} className="text-xs uppercase">
                        {t}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </>
              )}

              {(sort !== "recency-desc" || readTime !== "any" || tag !== "All") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate({ search: { tag: "All", sort: "recency-desc", readTime: "any" } });
                    }}
                    className="justify-center text-center font-mono text-[10px] uppercase tracking-widest text-gold"
                  >
                    Clear All Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* List */}
      <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
        {filteredItems.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            No posts in this filter yet.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
