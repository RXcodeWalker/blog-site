import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { getAllCategoriesWithCounts, getLatestPost, getLatestPosts } from "@/content/api.ts";
import type { PostRecord } from "@/content/api.ts";
import { obsessions, signals } from "@/lib/content";
import { ArrowUpRight, ArrowRight } from "lucide-react";

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
  const latestThree = getLatestPosts(3, 1);
  const categories = getAllCategoriesWithCounts();

  if (!feature) return null;

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-radial" />

        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-16 lg:px-12 lg:pt-20">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="h-px w-8 bg-gold" />
            <span>Arsenal · Code · Growth</span>
          </div>
          <h1 className="mt-6 max-w-5xl font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.92] tracking-[-0.03em] text-balance animate-fade-up">
            <span className="block">Beyond</span>
            <span className="block italic text-muted-foreground">The Basics</span>
            <span className="block">by Om Jhamvar.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            I'm a 10th grader from India documenting football analysis, software projects, and
            personal growth. No polish required, just honest work in progress.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              to="/article/$slug"
              params={{ slug: feature.slug }}
              className="group inline-flex items-center gap-3 rounded-full border border-foreground px-5 py-2.5 text-sm transition-colors hover:bg-foreground hover:text-background"
            >
              Read the latest
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground underline-grow"
            >
              About Me →
            </Link>
            <Link
              to="/start"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold hover:text-foreground underline-grow"
            >
              New here? Start here →
            </Link>
          </div>
        </div>

        {/* Obsessions ticker */}
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

      {/* FEATURED */}
      <section className="mx-auto max-w-[1440px] px-6 pt-16 lg:px-12">
        <SectionLabel num="01" title="Featured Essay" kicker="The current dispatch" />
        <FeaturedCard post={feature} />
      </section>

      {/* GRID OF ESSAYS */}
      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <SectionLabel num="02" title="Latest Essays" kicker="A reading list, ordered by recency" />
        <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {latestThree.map((post, i) => (
            <ArticleCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* SIGNAL LOGS */}
      <section className="mt-20 border-y border-border bg-secondary/40">
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
          <ol className="mt-8 lg:col-span-8 lg:mt-0">
            {signals.map((s, i) => (
              <li key={s.id}>
                {i > 0 && <div className="editorial-rule" />}
                <a
                  className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 py-5 md:py-6"
                  href="#"
                >
                  <span className="font-mono text-sm text-gold">{s.id}</span>
                  <p className="font-serif text-xl leading-snug tracking-tight text-balance md:text-2xl">
                    {s.text}
                  </p>
                  <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CATEGORY ATLAS */}
      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <SectionLabel num="04" title="Categories" kicker="Where the work lives" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, idx) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative bg-card p-6 transition-all duration-500 hover:bg-secondary"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {String(idx + 1).padStart(2, "0")} / {c.count} {c.count === 1 ? "entry" : "entries"}
              </div>
              <div className="mt-5 font-serif text-2xl font-light leading-tight transition-transform duration-500 group-hover:-translate-y-0.5">
                {c.name}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.desc}</p>
              <ArrowUpRight className="absolute right-6 top-6 h-4 w-4 text-muted-foreground opacity-0 transition-all duration-500 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* SERIES + READING LIST */}
      <section className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionLabel num="05" title="Now Building" kicker="" />
            <ul className="mt-6 space-y-4">
              {[
                { n: "I", t: "Arsenal Match Reviews", c: "Football · ongoing" },
                { n: "II", t: "Learning in Public", c: "Growth · ongoing" },
                { n: "III", t: "Student Projects", c: "Code · ongoing" },
              ].map((s) => (
                <li
                  key={s.n}
                  className="group flex items-baseline gap-6 border-b border-border pb-4"
                >
                  <span className="font-serif text-2xl italic text-gold">{s.n}</span>
                  <div className="flex-1">
                    <div className="font-serif text-xl">{s.t}</div>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.c}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel num="06" title="Current Focus" kicker="" />
            <ul className="mt-6 space-y-4">
              {[
                { t: "Football Tactics", a: "Arsenal structure and game models" },
                { t: "Web Development", a: "Shipping and refining projects" },
                { t: "Python", a: "Data and automation practice" },
                { t: "Personal Growth", a: "Consistency and compounding" },
              ].map((b) => (
                <li
                  key={b.t}
                  className="flex items-baseline justify-between border-b border-border pb-4"
                >
                  <div>
                    <div className="font-serif text-lg italic">{b.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{b.a}</div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Reading
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12">
        <p className="font-serif text-2xl font-light leading-snug tracking-tight md:text-3xl text-pretty">
          <span className="text-gold">"</span>Build things that matter, and share what you learn
          along the way.<span className="text-gold">"</span>
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          — Beyond the Basics
        </p>
      </section>
    </SiteShell>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
      className="group mt-8 grid gap-8 md:grid-cols-12"
    >
      <div className="flex flex-col justify-end md:col-span-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
          {post.category}
        </div>
        <h2 className="mt-3 font-serif text-3xl font-light leading-[1.02] tracking-[-0.02em] text-balance md:text-4xl">
          {post.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>
            {post.author} · {displayDate}
          </span>
          <span>{post.readingTimeMinutes} min</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post }: { post: PostRecord; index: number }) {
  const displayDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to="/article/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col hover-lift"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
        {post.category}
      </div>
      <h3 className="mt-2 font-serif text-xl font-normal leading-tight tracking-tight">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{displayDate}</span>
        <span>{post.readingTimeMinutes} min</span>
      </div>
    </Link>
  );
}
