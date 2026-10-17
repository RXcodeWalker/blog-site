import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleCard } from "@/components/site/ArticleCard";
import { CategoryBadge } from "@/components/site/CategoryBadge";
import { PostCover } from "@/components/site/PostCover";
import {
  getAllCategoriesWithCounts,
  getLatestPost,
  getLatestPosts,
  getPostsByCategory,
} from "@/content/api.ts";
import type { PostRecord } from "@/content/api.ts";
import { categoryCssVars, getCategoryStyle } from "@/lib/categoryStyle";

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

const homeDescription =
  "Om Jhamvar, an 11th grader in India, writing Arsenal match reviews, notes on software he is building, and what school is actually teaching him.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond the Basics" },
      { name: "description", content: homeDescription },
      { property: "og:title", content: "Beyond the Basics" },
      { property: "og:description", content: homeDescription },
    ],
  }),
  component: Index,
});

function Index() {
  const feature = getLatestPost();
  const latestSix = getLatestPosts(6, 1);
  const categories = getAllCategoriesWithCounts().filter(
    (c) => c.count > 0 || c.slug === "journal",
  );

  if (!feature) return null;

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-mesh" />

        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-14 lg:px-12 lg:pb-14 lg:pt-16">
          <div className="lg:w-1/2 lg:pr-16">
            <h1 className="font-serif text-[clamp(2.4rem,4.4vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-balance">
              Beyond the <em className="italic text-gold">Basics</em>
            </h1>
            <p className="mt-3 max-w-md font-serif text-lg leading-snug text-foreground/85 md:text-xl">
              Arsenal from the stands, software from the desk, and school in between.
            </p>

            <div className="mt-8 border-t border-border pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Om Jhamvar
                <span className="mx-2.5 text-border">/</span>
                11th grade
                <span className="mx-2.5 text-border">/</span>
                India
              </p>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
                <p>
                  I'm Om Jhamvar. I watch Arsenal closely enough to write the match down
                  afterward: the shape of the team, the chance that should have been
                  finished, and whether a signing actually changes anything.
                </p>
                <p>
                  The other writing is about software I am building, and about school when
                  a class or a project is worth more than the grade. The newest piece is
                  just below. Everything else is filed by what it is about.
                </p>
              </div>
            </div>

            <Link
              to="/article/$slug"
              params={{ slug: feature.slug }}
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-background shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
            >
              Read the latest
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-12">
        <SectionLabel num="01" title="Featured" kicker="The newest post" />
        <FeaturedCard post={feature} />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <SectionLabel num="02" title="Categories" kicker="Choose a lane" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, idx) => {
            const latest = getPostsByCategory(c.slug)[0];
            const Icon = getCategoryStyle(c.slug).icon;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                style={categoryCssVars(c.slug)}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 gradient-border transition-transform duration-500 hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.16] transition-opacity duration-500 group-hover:opacity-25"
                  style={{
                    backgroundImage: `url(${c.defaultCover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background/80 to-[color-mix(in_oklab,var(--cat)_18%,transparent)]" />
                <div
                  className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                  style={{ background: "var(--cat)" }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--cat)_20%,transparent)] text-[var(--cat)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-serif text-4xl font-light leading-none text-foreground/80">
                      {String(c.count).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")} / {c.count} {c.count === 1 ? "entry" : "entries"}
                  </div>
                  <div className="mt-2 font-serif text-2xl font-light leading-tight">{c.name}</div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.desc}</p>
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cat)]">
                    {latest ? categoryLatestLine(c.count, latest) : "No entries yet"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-20 pb-8 lg:px-12">
        <SectionLabel num="03" title="Latest" kicker="Newest first, across the site" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latestSix.map((post, i) => (
            <ArticleCard
              key={post.slug}
              post={post}
              variant={i === 0 ? "wide" : "default"}
            />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function categoryLatestLine(count: number, latest: PostRecord) {
  const age = Date.now() - new Date(latest.publishedAt).getTime();
  if (count === 1 && age > YEAR_MS) {
    return `From ${new Date(latest.publishedAt).getFullYear()} · ${latest.title}`;
  }
  return `Latest · ${latest.title}`;
}

function SectionLabel({ num, title, kicker }: { num: string; title: string; kicker: string }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — {num}
        </div>
        <h2 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
      </div>
      {kicker && (
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">
          {kicker}
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ post }: { post: PostRecord }) {
  const displayDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to="/article/$slug"
      params={{ slug: post.slug }}
      style={categoryCssVars(post.category)}
      className="group surface-card gradient-border sheen mt-8 grid overflow-hidden rounded-2xl border border-border md:grid-cols-12"
    >
      <div className="relative aspect-[4/3] md:col-span-7 md:aspect-auto md:min-h-[420px]">
        <PostCover
          slug={post.slug}
          category={post.category}
          photo={post.cover}
          photoAlt=""
          priority
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-col justify-end p-6 md:col-span-5 md:p-10">
        <CategoryBadge slug={post.category} size="md" />
        <h3 className="mt-4 font-serif text-3xl font-light leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl">
          {post.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-gold">
            OJ
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {post.author} · {displayDate}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {post.readingTimeMinutes} min
          </span>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--cat)]">
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
