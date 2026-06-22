import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { getPostBySlug, getRelatedPosts, getAdjacentPosts, getSeriesPosts } from "@/content/api.ts";
import { getInteractions } from "@/lib/interactions";
import { mdxComponents } from "@/content/render/mdx-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { shareOrCopy } from "@/lib/share";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useReadingPosition } from "@/hooks/useReadingPosition";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSpeech } from "@/hooks/useSpeech";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useArticleShortcuts } from "@/hooks/useArticleShortcuts";
import { ReadingRail } from "@/components/article/ReadingRail";
import { MobileActionBar } from "@/components/article/MobileActionBar";
import { TableOfContents } from "@/components/article/TableOfContents";
import { QuoteShare } from "@/components/article/QuoteShare";
import { SubscribeCTA } from "@/components/article/SubscribeCTA";
import { PrevNextNav } from "@/components/article/PrevNextNav";
import { SeriesNav } from "@/components/article/SeriesNav";
import { ShortcutsHelp } from "@/components/article/ShortcutsHelp";
import { Interactions } from "@/components/article/Interactions";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    const interactions = await getInteractions({ data: params.slug });
    // Strip the Content component (a non-serializable function) so TanStack Router
    // can inject the dehydrated router state needed for client-side hydration.
    // The component re-fetches it via getPostBySlug, which is a cheap in-memory lookup.
    const { Content: _content, ...serializablePost } = post;
    return { post: serializablePost, interactions };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.post
      ? [
          { title: `${loaderData.post.title} — Beyond the Basics` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.cover },
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
  const { post: loaderPost, interactions } = Route.useLoaderData();
  // Re-resolve the full post (including non-serializable Content component) from the
  // in-memory manifest — same data, available on both server and client.
  const post = getPostBySlug(loaderPost.slug)!;
  const { Content } = post;
  const related = getRelatedPosts(post, 3);
  const { prev, next } = getAdjacentPosts(post);
  const seriesPosts = getSeriesPosts(post);

  const bodyRef = useRef<HTMLDivElement>(null);

  const { progress, minutesLeft, activeHeadingId } = useReadingProgress(
    post.readingTimeMinutes,
    post.headings,
    { slug: post.slug, category: post.category },
  );
  const { savedPercent, resume, dismiss } = useReadingPosition(post.slug);
  const { isBookmarked, toggle } = useBookmarks();
  const speech = useSpeech();
  const [focusMode, setFocusMode] = useLocalStorageState("btb:focus-mode", false);
  const [tocHidden, setTocHidden] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  const bookmarked = isBookmarked(post.slug);

  // Apply focus-mode class to <html> so global chrome can dim (see styles.css).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("focus-mode", focusMode);
    return () => root.classList.remove("focus-mode");
  }, [focusMode]);

  useEffect(() => {
    if (shareStatus === "idle") return;
    const t = window.setTimeout(() => setShareStatus("idle"), 2500);
    return () => window.clearTimeout(t);
  }, [shareStatus]);

  const handleShare = useCallback(async () => {
    const outcome = await shareOrCopy({
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    });
    setShareStatus(outcome);
    if (outcome === "copied") toast.success("Link copied to clipboard");
    else if (outcome === "error") toast.error("Couldn't share — please copy the URL manually");
  }, [post.title, post.excerpt]);

  const handleToggleBookmark = useCallback(() => {
    const adding = !isBookmarked(post.slug);
    toggle(post.slug);
    toast.success(adding ? "Saved to reading list" : "Removed from reading list");
  }, [toggle, isBookmarked, post.slug]);

  const handleToggleListen = useCallback(() => {
    speech.toggle(() => bodyRef.current?.textContent ?? post.excerpt);
  }, [speech, post.excerpt]);

  useArticleShortcuts({
    onBookmark: handleToggleBookmark,
    onToggleFocus: () => setFocusMode((v) => !v),
    onToggleToc: () => setTocHidden((v) => !v),
    onToggleHelp: () => setHelpOpen((v) => !v),
  });

  const displayDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const shareLabel =
    shareStatus === "shared"
      ? "Shared"
      : shareStatus === "copied"
        ? "Copied"
        : shareStatus === "error"
          ? "Error"
          : "Share";

  return (
    <SiteShell>
      {/* Progress bar */}
      <div data-reading-chrome className="fixed left-0 right-0 top-16 z-30 h-px bg-transparent">
        <div
          className="h-px bg-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <QuoteShare containerRef={bodyRef} title={post.title} />
      <ShortcutsHelp open={helpOpen} onOpenChange={setHelpOpen} />

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

        {/* Resume prompt */}
        {savedPercent !== null && (
          <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between gap-4 rounded border border-border bg-secondary/40 px-6 py-3">
            <button
              type="button"
              onClick={resume}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 text-gold" />
              Resume where you left off ({Math.round(savedPercent)}%)
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Series index (kept outside .reading-prose so it doesn't inherit prose styles) */}
        {seriesPosts.length > 1 && (
          <div className="mt-16 px-6">
            <SeriesNav posts={seriesPosts} currentSlug={post.slug} />
          </div>
        )}

        {/* Body + rails */}
        <div className="relative mx-auto mt-20 grid max-w-[1280px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
          <ReadingRail
            bookmarked={bookmarked}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            shareLabel={shareLabel}
            listenSupported={speech.supported}
            listenState={speech.state}
            onToggleListen={handleToggleListen}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((v) => !v)}
            progress={progress}
            minutesLeft={minutesLeft}
          />

          <div ref={bodyRef} className="reading-prose">
            <Content components={mdxComponents} />
          </div>

          <div className="hidden lg:block">
            {!tocHidden && (
              <div data-reading-chrome className="lg:sticky lg:top-32 lg:pl-8">
                <TableOfContents headings={post.headings} activeId={activeHeadingId} />
              </div>
            )}
          </div>
        </div>

        <SubscribeCTA />

        <Interactions slug={post.slug} initialInteractions={interactions} />

        {/* Author + CTA */}
        <div className="mx-auto mt-16 max-w-2xl px-6">
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

        <PrevNextNav prev={prev} next={next} />
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

      {/* Spacer so the mobile action bar never covers the footer */}
      <div className="h-20 lg:hidden" />

      <MobileActionBar
        bookmarked={bookmarked}
        onToggleBookmark={handleToggleBookmark}
        onShare={handleShare}
        listenSupported={speech.supported}
        listenState={speech.state}
        onToggleListen={handleToggleListen}
        progress={progress}
        headings={post.headings}
        activeHeadingId={activeHeadingId}
      />
    </SiteShell>
  );
}
