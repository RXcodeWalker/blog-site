import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { getPostBySlug, getRelatedPosts } from "@/content/api.ts";
import { mdxComponents } from "@/content/render/mdx-components";
import { useEffect, useState } from "react";
import { Bookmark, Share2, ArrowUpRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Beyond the Basics` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:image", content: loaderData.cover },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-serif text-5xl">Article not found</h1>
        <Link
          to="/"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-widest underline-grow"
        >
          ← Back to index
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">{error.message}</div>
    </SiteShell>
  ),
  component: Article,
});

function Article() {
  const post = Route.useLoaderData();
  const { Content } = post;
  const related = getRelatedPosts(post, 3);

  const [progress, setProgress] = useState(0);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (shareStatus === "idle") return;
    const timeout = window.setTimeout(() => setShareStatus("idle"), 2500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const copyArticleUrl = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    try {
      textarea.select();
      if (!document.execCommand("copy")) throw new Error("Copy command was rejected");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title: post.title, text: post.excerpt, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
        return;
      }
      await copyArticleUrl(url);
      setShareStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await copyArticleUrl(url);
        setShareStatus("copied");
      } catch {
        setShareStatus("error");
      }
    }
  };

  // Format ISO date for display
  const displayDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <SiteShell>
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-16 z-30 h-px bg-transparent">
        <div
          className="h-px bg-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <article>
        <header className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center lg:pt-32">
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-3 w-3" /> All essays
          </Link>
          <div className="mt-12 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
            <span>{post.category}</span>
            <span className="h-px w-8 bg-border" />
            {post.tags[0] && <span>{post.tags[0]}</span>}
          </div>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.02] tracking-[-0.025em] text-balance">
            {post.title}
          </h1>
          <p className="mt-8 mx-auto max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground italic text-pretty md:text-2xl">
            {post.excerpt}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{displayDate}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{post.readingTimeMinutes} min</span>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded">
            <img src={post.cover} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Floating side rail */}
        <div className="relative mx-auto mt-20 grid max-w-[1280px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
          <aside className="hidden lg:flex lg:sticky lg:top-32 lg:h-fit lg:flex-col lg:items-end lg:gap-6 lg:pr-8">
            <button className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <Bookmark className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]">Save</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share ${post.title}`}
              className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]">
                {shareStatus === "shared"
                  ? "Shared"
                  : shareStatus === "copied"
                    ? "Copied"
                    : shareStatus === "error"
                      ? "Error"
                      : "Share"}
              </span>
            </button>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              {Math.round(progress)}%
            </div>
          </aside>

          {/* MDX body */}
          <div className="reading-prose">
            <Content components={mdxComponents} />
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Author + CTA */}
        <div className="mx-auto mt-24 max-w-2xl px-6">
          <div className="flex items-start gap-5 border-y border-border py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border font-serif italic text-gold">
              O
            </div>
            <div className="flex-1">
              <div className="font-serif text-lg">{post.author}</div>
              <div className="text-sm text-muted-foreground">
                Founding editor. Writes about the things he can't stop thinking about.
              </div>
            </div>
            <button className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground underline-grow">
              Follow →
            </button>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1440px] px-6 lg:px-12">
          <div className="border-b border-border pb-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              — Continue reading
            </div>
            <h3 className="mt-2 font-serif text-4xl font-light tracking-tight md:text-5xl">
              Adjacent essays
            </h3>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {related.map((r) => {
              const relatedDate = new Date(r.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <Link
                  key={r.slug}
                  to="/article/$slug"
                  params={{ slug: r.slug }}
                  className="group block hover-lift"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={r.cover}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
                    {r.category}
                  </div>
                  <h4 className="mt-2 font-serif text-2xl leading-tight">{r.title}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{relatedDate}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
