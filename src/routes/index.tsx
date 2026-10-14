import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleCard } from "@/components/site/ArticleCard";
import { CategoryBadge } from "@/components/site/CategoryBadge";
import { PostCover } from "@/components/site/PostCover";
import {
  getAllCategoriesWithCounts,
  getAllPosts,
  getLatestPost,
  getLatestPosts,
  getPostsByCategory,
} from "@/content/api.ts";
import type { PostRecord } from "@/content/api.ts";
import { obsessions, signals } from "@/lib/content";
import { categoryCssVars, getCategoryStyle } from "@/lib/categoryStyle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond the Basics — Arsenal · Code · Growth" },
      {
        name: "description",
        content:
          "Personal blog of Om Jhamvar. Football tactics, coding journeys, and growth notes shared in public.",
      },
      { property: "og:title", content: "Beyond the Basics — Arsenal · Code · Growth" },
      {
        property: "og:description",
        content: "Football tactics, coding journeys, and growth notes from Om Jhamvar.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const feature = getLatestPost();
  const latestSix = getLatestPosts(6, 1);
  const categories = getAllCategoriesWithCounts();
  const allPosts = getAllPosts();
  const latestFootball = getPostsByCategory("football")[0];
  const latestBuilding = getPostsByCategory("building")[0];

  if (!feature) return null;

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-mesh" />
        <PitchWatermark />

        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-16 lg:px-12 lg:pt-20">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="h-px w-8 bg-gold" />
            <span>Issue No. {String(allPosts.length).padStart(2, "0")}</span>
            <span className="text-border">·</span>
            <span>{today}</span>
            <span className="text-border">·</span>
            <span>Arsenal / Code / Growth</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.92] tracking-[-0.03em] text-balance animate-fade-up">
            <span className="block">Beyond</span>
            <span className="block italic text-gradient-brand">The Basics</span>
            <span className="block text-muted-foreground">by Om Jhamvar.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            I'm a 10th grader from India documenting football analysis, software projects, and
            personal growth. No polish required, just honest work in progress.
          </p>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StatusPill
              label="Latest match breakdown"
              value={latestFootball?.title ?? "Football notes"}
              to={latestFootball ? "/article/$slug" : "/category/$slug"}
              params={
                latestFootball
                  ? { slug: latestFootball.slug }
                  : { slug: "football" }
              }
            />
            <StatusPill
              label="Now building"
              value={latestBuilding?.title ?? "Student projects"}
              to={latestBuilding ? "/article/$slug" : "/category/$slug"}
              params={
                latestBuilding
                  ? { slug: latestBuilding.slug }
                  : { slug: "building" }
              }
            />
            <StatusPill
              label="Archive"
              value={`${allPosts.length} posts since 2020`}
              to="/archive"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/article/$slug"
              params={{ slug: feature.slug }}
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-background shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
            >
              Read the latest
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-foreground"
            >
              Start here
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-foreground"
            >
              About
            </Link>
          </div>
        </div>

        <div className="relative border-y border-border bg-background/40 py-3">
          <div className="marquee gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em]">
            {[...obsessions, ...obsessions].map((o, i) => (
              <span key={i} className="flex items-center gap-12">
                <span className="text-muted-foreground">Current obsession</span>
                <span className="text-gold">— {o} —</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-16 lg:px-12">
        <SectionLabel num="01" title="Featured Essay" kicker="The current dispatch" />
        <FeaturedCard post={feature} />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <SectionLabel num="02" title="Latest Essays" kicker="A reading list, ordered by recency" />
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

      <section className="mt-20 border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1440px] grid gap-0 px-6 py-12 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                — 03
              </div>
              <h3 className="mt-3 font-serif text-3xl font-light leading-[1.05] tracking-tight">
                From the Notebook
              </h3>
              <p className="mt-3 max-w-sm text-muted-foreground">
                Quick ideas from my week: match thoughts, coding notes, and lessons I want to
                remember.
              </p>
              <Link
                to="/category/$slug"
                params={{ slug: "football" }}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] underline-grow"
              >
                Read Football Posts <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:mt-0">
            {signals.map((s) => (
              <article
                key={s.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold/40"
              >
                <span className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-[0.4] bg-gold transition-transform duration-500 group-hover:scale-y-100" />
                <div className="font-serif text-3xl italic leading-none text-gold/80">#{s.id}</div>
                <p className="mt-3 font-serif text-lg leading-snug tracking-tight text-balance">
                  {s.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <SectionLabel num="04" title="Categories" kicker="Where the work lives" />
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
                    {String(idx + 1).padStart(2, "0")} / {c.count === 0 ? "soon" : `${c.count} ${c.count === 1 ? "entry" : "entries"}`}
                  </div>
                  <div className="mt-2 font-serif text-2xl font-light leading-tight">{c.name}</div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.desc}</p>
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cat)]">
                    {c.count === 0
                      ? "Coming soon"
                      : latest
                        ? `Latest · ${latest.title}`
                        : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionLabel num="05" title="Now Building" kicker="" />
            <ul className="mt-6 space-y-3">
              {[
                { n: "I", t: "Arsenal Match Reviews", c: "Football · ongoing" },
                { n: "II", t: "Learning in Public", c: "Growth · ongoing" },
                { n: "III", t: "Student Projects", c: "Code · ongoing" },
              ].map((s) => (
                <li
                  key={s.n}
                  className="surface-card group flex items-center gap-5 rounded-xl border border-border px-4 py-4"
                >
                  <span className="font-serif text-2xl italic text-gold">{s.n}</span>
                  <div className="flex-1">
                    <div className="font-serif text-xl">{s.t}</div>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.c}
                    </div>
                  </div>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                    Ongoing
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel num="06" title="Current Focus" kicker="" />
            <ul className="mt-6 space-y-3">
              {[
                { t: "Football Tactics", a: "Arsenal structure and game models" },
                { t: "Web Development", a: "Shipping and refining projects" },
                { t: "Python", a: "Data and automation practice" },
                { t: "Personal Growth", a: "Consistency and compounding" },
              ].map((b) => (
                <li
                  key={b.t}
                  className="surface-card flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-4"
                >
                  <div>
                    <div className="font-serif text-lg italic">{b.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{b.a}</div>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    Reading
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-28 text-center lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--gold)_14%,transparent),transparent_65%)]" />
        <p className="relative font-serif text-3xl font-light leading-snug tracking-tight md:text-4xl text-pretty">
          <span className="absolute -left-2 -top-8 font-serif text-7xl text-gold/30 md:-left-10">
            “
          </span>
          Build things that matter, and share what you learn along the way.
          <span className="text-gold/30">”</span>
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          — Beyond the Basics
        </p>
      </section>
    </SiteShell>
  );
}

function PitchWatermark() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.05]"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="80" y="40" width="640" height="320" />
        <line x1="400" y1="40" x2="400" y2="360" />
        <circle cx="400" cy="200" r="70" />
        <rect x="80" y="110" width="110" height="180" />
        <rect x="610" y="110" width="110" height="180" />
      </g>
    </svg>
  );
}

function StatusPill({
  label,
  value,
  to,
  params,
}: {
  label: string;
  value: string;
  to: "/article/$slug" | "/category/$slug" | "/archive";
  params?: { slug: string };
}) {
  const inner = (
    <>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[14rem] truncate text-foreground">{value}</span>
    </>
  );

  const cls =
    "inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-background/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur-md transition-colors hover:border-gold/40";

  if (to === "/archive") {
    return (
      <Link to="/archive" className={cls}>
        {inner}
      </Link>
    );
  }
  if (to === "/category/$slug") {
    return (
      <Link to="/category/$slug" params={params!} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/article/$slug" params={params!} className={cls}>
      {inner}
    </Link>
  );
}

function SectionLabel({ num, title, kicker }: { num: string; title: string; kicker: string }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — {num}
        </div>
        <h3 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">{title}</h3>
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
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-col justify-end p-6 md:col-span-5 md:p-10">
        <CategoryBadge slug={post.category} size="md" />
        <h2 className="mt-4 font-serif text-3xl font-light leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl">
          {post.title}
        </h2>
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
          Read essay
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
