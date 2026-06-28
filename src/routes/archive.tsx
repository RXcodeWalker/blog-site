import { useMemo, useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { getAllPosts, getAllCategoriesWithCounts, getPostYears } from "@/content/api.ts";
import type { CategoryWithCount, PostRecord } from "@/content/api.ts";
import { ArchivePostRow } from "@/components/archive/ArchivePostRow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 50;

const archiveSearchSchema = z.object({
  view: z.enum(["timeline", "category"]).catch("timeline"),
  q: z.string().catch(""),
  category: z.string().catch("all"),
  tag: z.string().catch("All"),
  readTime: z.enum(["any", "short", "medium", "long"]).catch("any"),
  year: z.string().catch("all"),
  sort: z
    .enum(["recency-desc", "recency-asc", "title-asc", "title-desc", "length-desc", "length-asc"])
    .catch("recency-desc"),
  page: z.coerce.number().int().min(1).catch(1),
});

type ArchiveSearch = z.infer<typeof archiveSearchSchema>;
type SortOption = ArchiveSearch["sort"];
type ReadTimeOption = ArchiveSearch["readTime"];

export const Route = createFileRoute("/archive")({
  validateSearch: archiveSearchSchema,
  loader: () => ({
    posts: getAllPosts(),
    categories: getAllCategoriesWithCounts(),
    years: getPostYears(),
  }),
  head: ({ loaderData }) => {
    const posts = loaderData?.posts;
    if (!posts) return {};
    const years = getPostYears();
    const description = `Every post on Beyond the Basics — ${posts.length} entries spanning ${years.at(-1)}–${years.at(0)}, covering football tactics, mindset, coding, and more.`;

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    const base = "https://beyondthebasics.me/archive";

    const links: Array<{ rel: string; href: string }> = [{ rel: "canonical", href: base }];
    if (totalPages > 1) {
      links.push({ rel: "next", href: `${base}?page=2` });
    }

    return {
      meta: [
        { title: "Archive — Beyond the Basics" },
        { name: "description", content: description },
        { property: "og:title", content: "Archive — Beyond the Basics" },
        { property: "og:description", content: description },
      ],
      links,
    };
  },
  component: Archive,
});

function applyFilters(
  posts: readonly PostRecord[],
  { q, category, tag, readTime, year, sort }: Omit<ArchiveSearch, "view" | "page">,
): PostRecord[] {
  let base = [...posts];

  if (q.trim()) {
    const term = q.toLowerCase().trim();
    base = base.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    );
  }

  if (category !== "all") {
    base = base.filter((p) => p.category === category);
  }

  if (tag !== "All") {
    base = base.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (readTime !== "any") {
    base = base.filter((p) => {
      if (readTime === "short") return p.readingTimeMinutes < 5;
      if (readTime === "medium") return p.readingTimeMinutes >= 5 && p.readingTimeMinutes <= 10;
      if (readTime === "long") return p.readingTimeMinutes > 10;
      return true;
    });
  }

  if (year !== "all") {
    const y = parseInt(year, 10);
    base = base.filter((p) => new Date(p.publishedAt).getFullYear() === y);
  }

  return base.sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);
    if (sort === "length-desc") return b.readingTimeMinutes - a.readingTimeMinutes;
    if (sort === "length-asc") return a.readingTimeMinutes - b.readingTimeMinutes;
    if (sort === "recency-asc")
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

function Archive() {
  const { posts: allPosts, categories, years } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { view, q: urlQ, category, tag, readTime, year, sort, page } = search;

  const [localQ, setLocalQ] = useState(urlQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalQ(urlQ);
  }, [urlQ]);

  const handleQChange = (value: string) => {
    setLocalQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void navigate({ search: (prev) => ({ ...prev, q: value, page: 1 }) });
    }, 400);
  };

  const setParam = <K extends keyof ArchiveSearch>(key: K, value: ArchiveSearch[K]) => {
    void navigate({ search: (prev) => ({ ...prev, [key]: value, page: 1 }) });
  };

  const clearAll = () => {
    setLocalQ("");
    void navigate({
      search: {
        view,
        q: "",
        category: "all",
        tag: "All",
        readTime: "any",
        year: "all",
        sort: "recency-desc",
        page: 1,
      },
    });
  };

  const filteredPosts = useMemo(
    () => applyFilters(allPosts, { q: urlQ, category, tag, readTime, year, sort }),
    [allPosts, urlQ, category, tag, readTime, year, sort],
  );

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const isFiltered =
    urlQ !== "" ||
    category !== "all" ||
    tag !== "All" ||
    readTime !== "any" ||
    year !== "all" ||
    sort !== "recency-desc";

  const activeFilterCount = [
    urlQ !== "",
    category !== "all",
    tag !== "All",
    readTime !== "any",
    year !== "all",
    sort !== "recency-desc",
  ].filter(Boolean).length;
  void activeFilterCount; // used visually via isFiltered

  const oldestYear = years.at(-1);
  const newestYear = years.at(0);

  const sortLabels: Record<SortOption, string> = {
    "recency-desc": "Most Recent",
    "recency-asc": "Oldest First",
    "title-asc": "Title (A–Z)",
    "title-desc": "Title (Z–A)",
    "length-desc": "Longest Read",
    "length-asc": "Shortest Read",
  };

  const readTimeLabels: Record<ReadTimeOption, string> = {
    any: "Any Length",
    short: "Short (< 5m)",
    medium: "Medium (5–10m)",
    long: "Long (> 10m)",
  };

  return (
    <SiteShell>
      {/* JSON-LD for CollectionPage (unfiltered only) */}
      {!isFiltered && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Archive — Beyond the Basics",
              url: "https://beyondthebasics.me/archive",
              numberOfItems: allPosts.length,
              author: { "@type": "Person", name: "Om Jhamvar" },
              hasPart: pagedPosts.map((p) => ({
                "@type": "Article",
                name: p.title,
                url: `https://beyondthebasics.me/article/${p.slug}`,
                datePublished: p.publishedAt,
              })),
            }),
          }}
        />
      )}

      {/* Sticky filter bar */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {/* Top row: search + view toggle */}
          <div className="flex items-center gap-3 py-3">
            <div className="relative flex-1 max-w-sm">
              <input
                value={localQ}
                onChange={(e) => handleQChange(e.target.value)}
                placeholder="Search archive…"
                className="w-full rounded-md border border-border bg-secondary/40 px-3 py-1.5 font-mono text-[11px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              {localQ && (
                <button
                  onClick={() => handleQChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
              <button
                aria-pressed={view === "timeline"}
                onClick={() => setParam("view", "timeline")}
                className={`rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  view === "timeline"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Timeline
              </button>
              <button
                aria-pressed={view === "category"}
                onClick={() => setParam("view", "category")}
                className={`rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  view === "category"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Category
              </button>
            </div>
          </div>

          {/* Bottom row: category pills + year + filter+sort + clear */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 font-mono text-[10px] uppercase tracking-[0.18em]">
            <button
              onClick={() => setParam("category", "all")}
              className={`whitespace-nowrap rounded-full border px-3 py-1 transition-colors ${
                category === "all"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setParam("category", c.slug)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 transition-colors ${
                  category === c.slug
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}

            {/* Year dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`ml-2 gap-1.5 rounded-full border-border px-3 text-[10px] uppercase tracking-[0.18em] ${
                    year !== "all" ? "border-foreground bg-secondary" : ""
                  }`}
                >
                  {year === "all" ? "Year" : year}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                <DropdownMenuRadioGroup value={year} onValueChange={(v) => setParam("year", v)}>
                  <DropdownMenuRadioItem value="all" className="text-xs uppercase">
                    All Years
                  </DropdownMenuRadioItem>
                  {years.map((y) => (
                    <DropdownMenuRadioItem key={y} value={String(y)} className="text-xs uppercase">
                      {y}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter & Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1.5 rounded-full border-border px-3 text-[10px] uppercase tracking-[0.18em] ${
                    tag !== "All" || readTime !== "any" || sort !== "recency-desc"
                      ? "border-foreground bg-secondary"
                      : ""
                  }`}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  Filter & Sort
                  {(tag !== "All" || readTime !== "any" || sort !== "recency-desc") && (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-background">
                      {[tag !== "All", readTime !== "any", sort !== "recency-desc"].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Sort By
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(v) => setParam("sort", v as SortOption)}
                >
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
                  onValueChange={(v) => setParam("readTime", v as ReadTimeOption)}
                >
                  {Object.entries(readTimeLabels).map(([val, label]) => (
                    <DropdownMenuRadioItem key={val} value={val} className="text-xs uppercase">
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tag
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={tag} onValueChange={(v) => setParam("tag", v)}>
                  {["All", "Articles", "Notes", "Series"].map((t) => (
                    <DropdownMenuRadioItem key={t} value={t} className="text-xs uppercase">
                      {t}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                {(tag !== "All" || readTime !== "any" || sort !== "recency-desc") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        void navigate({
                          search: (prev) => ({
                            ...prev,
                            tag: "All",
                            readTime: "any",
                            sort: "recency-desc",
                            page: 1,
                          }),
                        });
                      }}
                      className="justify-center text-center font-mono text-[10px] uppercase tracking-widest text-gold"
                    >
                      Clear Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isFiltered && (
              <button
                onClick={clearAll}
                className="ml-auto whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Page header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Archive / Every Post
          </div>
          <div className="mt-2 flex items-baseline gap-6">
            <h1 className="font-serif text-4xl font-light tracking-tight">
              {filteredPosts.length} {filteredPosts.length === 1 ? "entry" : "entries"}
            </h1>
            {!isFiltered && oldestYear && newestYear && (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {oldestYear} – {newestYear}
              </span>
            )}
          </div>
          {/* Cmd+K nudge — hidden on mobile */}
          <p className="mt-3 hidden text-sm text-muted-foreground md:block">
            Looking for something specific? Press{" "}
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>{" "}
            <span className="hidden lg:inline">
              (or{" "}
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
                Ctrl+K
              </kbd>{" "}
              on Windows){" "}
            </span>
            to search.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
        {filteredPosts.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            No posts match these filters.
          </p>
        ) : view === "timeline" ? (
          <TimelineView posts={pagedPosts} allFilteredPosts={filteredPosts} />
        ) : (
          <CategoryView posts={pagedPosts} categories={categories} />
        )}

        {/* Pagination — only when > PAGE_SIZE results */}
        {totalPages > 1 && (
          <div className="mt-16">
            <ArchivePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })}
            />
          </div>
        )}
      </section>
    </SiteShell>
  );
}

// ---------------------------------------------------------------------------
// Timeline View
// ---------------------------------------------------------------------------

function TimelineView({
  posts,
  allFilteredPosts,
}: {
  posts: PostRecord[];
  allFilteredPosts: PostRecord[];
}) {
  const yearGroups = useMemo(() => {
    const map = new Map<number, PostRecord[]>();
    for (const p of allFilteredPosts) {
      const y = new Date(p.publishedAt).getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return map;
  }, [allFilteredPosts]);

  const groupedPage = useMemo(() => {
    const map = new Map<number, PostRecord[]>();
    for (const p of posts) {
      const y = new Date(p.publishedAt).getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return map;
  }, [posts]);

  const sortedYears = [...groupedPage.keys()].sort((a, b) => b - a);

  const [openYears, setOpenYears] = useState<Set<number>>(() => new Set(sortedYears));

  const toggleYear = (y: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {sortedYears.map((y) => (
        <Collapsible key={y} open={openYears.has(y)} onOpenChange={() => toggleYear(y)}>
          <CollapsibleTrigger className="flex w-full items-center gap-3 py-2 text-left">
            {openYears.has(y) ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
              {y}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              ({yearGroups.get(y)?.length ?? 0})
            </span>
            <span className="ml-auto h-px flex-1 bg-border" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="divide-y divide-border border-b border-border">
              {groupedPage.get(y)!.map((post) => (
                <ArchivePostRow key={post.slug} post={post} showCategory />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category View
// ---------------------------------------------------------------------------

function CategoryView({
  posts,
  categories,
}: {
  posts: PostRecord[];
  categories: readonly CategoryWithCount[];
}) {
  const byCategory = useMemo(() => {
    const map = new Map<string, PostRecord[]>();
    for (const p of posts) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return map;
  }, [posts]);

  return (
    <div className="space-y-12">
      {categories.map((c) => {
        const catPosts = byCategory.get(c.slug) ?? [];
        if (catPosts.length === 0) return null;
        return (
          <div key={c.slug}>
            <div className="mb-4 flex items-baseline gap-4 border-b border-border pb-2">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
                {c.name}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                ({catPosts.length})
              </span>
            </div>
            <ul className="divide-y divide-border">
              {catPosts.map((post) => (
                <ArchivePostRow key={post.slug} post={post} showCategory={false} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function ArchivePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages: Array<number | "ellipsis"> = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
