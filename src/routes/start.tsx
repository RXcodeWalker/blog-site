import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { getAllCategoriesWithCounts, getAllPosts, getPostBySlug } from "@/content/api.ts";
import type { PostRecord } from "@/content/api.ts";
import { SubscribeCTA } from "@/components/article/SubscribeCTA";
import {
  ArrowRight,
  ArrowUpRight,
  Target,
  Brain,
  User,
  Code2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildHead } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CURATED_SLUGS = [
  "arsenal-destroy-madrid-3-0",
  "how-to-become-37-78x-better-each-year",
  "arsenals-attacking-struggles",
  "leadership-essentially",
  "year-in-review-whats-wrong-with-arsenal",
  "my-summer-at-ashoka-university",
];

interface ReaderPath {
  icon: LucideIcon;
  title: string;
  audience: string;
  slugs: string[];
  cta:
    | { label: string; to: "/category/$slug"; params: { slug: string } }
    | { label: string; to: "/about" };
}

const READER_PATHS: ReaderPath[] = [
  {
    icon: Target,
    title: "Football Analyst",
    audience: "You want tactical breakdowns and match analysis.",
    slugs: [
      "arsenal-destroy-madrid-3-0",
      "arsenals-attacking-struggles",
      "game-review-arsenal-vs-tottenham",
    ],
    cta: { label: "Football →", to: "/category/$slug", params: { slug: "football" } },
  },
  {
    icon: Brain,
    title: "Mindset Reader",
    audience: "You want growth frameworks and mental models.",
    slugs: [
      "how-to-become-37-78x-better-each-year",
      "leadership-essentially",
      "confirmation-bias-we-sure-love-ourselves",
    ],
    cta: { label: "Mindset →", to: "/category/$slug", params: { slug: "mindset" } },
  },
  {
    icon: User,
    title: "Who is Om?",
    audience: "You're reviewing Om's full profile and range.",
    slugs: [
      "arsenal-destroy-madrid-3-0",
      "how-to-become-37-78x-better-each-year",
      "my-summer-at-ashoka-university",
    ],
    cta: { label: "Full story →", to: "/about" },
  },
  {
    icon: Code2,
    title: "Builder / Coder",
    audience: "You want technical thinking and software projects.",
    slugs: [
      "why-i-started-building-french-coach",
      "i-thought-i-was-building-a-productivity-app",
      "building-starts-here",
    ],
    cta: { label: "Building →", to: "/category/$slug", params: { slug: "building" } },
  },
];

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/start")({
  head: () =>
    buildHead({
      title: "Start Here",
      description:
        "New to Beyond the Basics? Start here. Find the right work fast, whatever you're looking for.",
      path: "/start",
    }),
  component: StartHere,
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function StartHere() {
  const curated = CURATED_SLUGS.map((s) => getPostBySlug(s)).filter(
    Boolean
  ) as PostRecord[];

  return (
    <SiteShell>
      {/* A. WELCOME HERO */}
      <section className="mx-auto max-w-[1280px] px-6 pb-12 pt-16 lg:px-12 lg:pt-20">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — Start Here
        </div>
        <h1 className="mt-6 max-w-3xl font-serif text-[clamp(2rem,6vw,4.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-balance">
          New here? This is where to begin.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          I'm Om Jhamvar — a student from India who writes about Arsenal tactics,
          building software, and growing up in public. This page cuts through the
          archive and gets you to the right work, fast.
        </p>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground/70 text-pretty">
          Beyond the Basics is a personal blog covering football analysis, software
          projects, and mental models — shared openly as I figure things out.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground underline-grow"
        >
          Or browse the full archive →
        </Link>
      </section>

      {/* B. READER PATHS */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-12">
        <div className="border-b border-border pb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            — 01
          </div>
          <h2 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
            Choose your entry point
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {READER_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.title}
                className="flex flex-col rounded-sm border border-border bg-secondary/60 p-6 transition-colors hover:bg-secondary"
              >
                <Icon className="h-5 w-5 text-gold" />
                <div className="mt-4 font-serif text-xl font-light leading-tight">
                  {path.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{path.audience}</p>
                <ul className="mt-4 flex-1 space-y-1">
                  {path.slugs.map((slug) => {
                    const post = getPostBySlug(slug);
                    if (!post) return null;
                    return (
                      <li key={slug}>
                        <Link
                          to="/article/$slug"
                          params={{ slug }}
                          className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 hover:text-foreground"
                        >
                          — {post.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 border-t border-border pt-4">
                  {path.cta.to === "/category/$slug" ? (
                    <Link
                      to="/category/$slug"
                      params={path.cta.params}
                      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-gold hover:text-foreground transition-colors"
                    >
                      {path.cta.label} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-gold hover:text-foreground transition-colors"
                    >
                      {path.cta.label} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* C. CURATED "BEST OF" */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-12">
        <div className="border-b border-border pb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            — 02
          </div>
          <h2 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
            The Work
          </h2>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {curated.map((post, i) => (
            <CuratedCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* D. ABOUT THE AUTHOR */}
      <section className="mx-auto max-w-[1280px] border-t border-border px-6 pb-20 pt-12 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              — 03
            </div>
            <h2 className="mt-2 font-serif text-3xl font-light tracking-tight md:text-4xl">
              About Om
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Om Jhamvar is a student from India writing about Arsenal, software, and
              growth. He publishes match analysis, leadership essays, and reflections
              in public. LCM Grade 8 Guitar with High Distinction.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] underline-grow"
            >
              Full story <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: String(getAllPosts().length), label: "Posts" },
                {
                  value: String(getAllCategoriesWithCounts().filter((c) => c.count > 0).length),
                  label: "Categories",
                },
                { value: "2020", label: "Since" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-sm border border-border bg-secondary/60 p-4 text-center"
                >
                  <div className="font-serif text-3xl font-light text-gold">{value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* E. NEWSLETTER CTA */}
      <SubscribeCTA />
      <div className="pb-16" />
    </SiteShell>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CuratedCard({ post }: { post: PostRecord; index: number }) {
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
