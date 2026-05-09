import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { articles } from "@/lib/content";
import { useEffect, useState } from "react";
import { Bookmark, Share2, ArrowUpRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => {
    const a = articles.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Beyond the Basics` },
          { name: "description", content: loaderData.dek },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.dek },
          { property: "og:image", content: loaderData.cover },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-serif text-5xl">Article not found</h1>
        <Link to="/" className="mt-6 inline-block font-mono text-xs uppercase tracking-widest underline-grow">← Back to index</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell><div className="mx-auto max-w-2xl px-6 py-40 text-center">{error.message}</div></SiteShell>
  ),
  component: Article,
});

function Article() {
  const a = Route.useLoaderData();
  const [progress, setProgress] = useState(0);

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

  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <SiteShell>
      {/* progress bar */}
      <div className="fixed left-0 right-0 top-16 z-30 h-px bg-transparent">
        <div className="h-px bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* HERO */}
      <article>
        <header className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center lg:pt-32">
          <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="h-3 w-3" /> All essays
          </Link>
          <div className="mt-12 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
            <span>{a.category}</span>
            <span className="h-px w-8 bg-border" />
            <span>{a.tag}</span>
          </div>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.02] tracking-[-0.025em] text-balance">
            {a.title}
          </h1>
          <p className="mt-8 mx-auto max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground italic text-pretty md:text-2xl">
            {a.dek}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{a.author}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{a.date}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{a.read} min</span>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded">
            <img src={a.cover} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Floating side rail */}
        <div className="relative mx-auto mt-20 grid max-w-[1280px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_minmax(0,680px)_1fr]">
          <aside className="hidden lg:flex lg:sticky lg:top-32 lg:h-fit lg:flex-col lg:items-end lg:gap-6 lg:pr-8">
            <button className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <Bookmark className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]">Save</span>
            </button>
            <button className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <Share2 className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]">Share</span>
            </button>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{Math.round(progress)}%</div>
          </aside>

          <div className="reading-prose">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-normal first-letter:leading-[0.85] first-letter:text-gold">
              There is a moment in every match — usually around the seventieth minute, after the structure has been tested and the legs have begun to fail — when the truth of a team's design becomes visible. Not the formation on a tactics board. The deeper thing: the implicit agreements about space, the rehearsed reactions, the things players do without looking.
            </p>
            <p>
              This essay is about that deeper thing. It is also about something larger: the way that all great systems — football teams, software architectures, philosophical frameworks — share a common geometry. Once you learn to see it, you cannot un-see it.
            </p>

            <h2>The Compression</h2>
            <p>
              Watch a Klopp side defend in their own third. The first thing you notice is what they don't do. They do not chase. They do not lunge. They <strong>compress</strong> — the entire shape collapsing inward, six players within a fifteen-meter radius, channels closed, passing lanes severed.
            </p>

            <blockquote>
              The press is not a question of running. It is a question of geometry — the deliberate manipulation of the available space until the opponent has no good options left.
            </blockquote>

            <p>
              This is not new. Sacchi understood it at Milan in 1989. Cruyff understood it at Ajax a decade earlier. What is new is the precision. Modern data lets coaches see, in real time, the exact dimensions of the compactness — the vertical distance between defense and attack, the horizontal width of each line — and adjust accordingly.
            </p>

            <h3>A note on Verlässlichkeit</h3>
            <p>
              The German word <em>Verlässlichkeit</em> — reliability, dependability — is the highest compliment one can pay a player in the Bundesliga. It is also, I would argue, the most underrated quality in any complex system. Brilliance is overrated. Reliability scales.
            </p>

            <h2>The Trigger</h2>
            <p>
              Every press has a <strong>trigger</strong> — a specific event that causes the unit to spring forward as one. A back-pass. A heavy first touch. A throw-in to a center back. The trigger is the most important detail nobody talks about, because without it, pressing is just running. With it, pressing is a coordinated strike.
            </p>

            <p>
              The same logic applies in software. Event-driven systems work because the events are the triggers. Without them, you have nothing but polling — wasted motion, wasted heat. The art is in choosing the right triggers.
            </p>

            <blockquote>
              The trigger is the most important detail nobody talks about, because without it, pressing is just running.
            </blockquote>

            <h2>What it costs</h2>
            <p>
              Pressing is expensive. It costs energy, it costs concentration, it costs — eventually — the bodies of the players who do it. There is no free press. The teams that make it look free are the teams that have engineered every other variable so carefully that the cost is hidden inside the structure.
            </p>

            <p>
              This is the closing thought, and the one I want you to carry with you: <strong>every system has a hidden cost</strong>. The teams, the companies, the philosophies that endure are not the ones that escape the cost. They are the ones that have decided, deliberately, where the cost will be paid.
            </p>
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Footnotes */}
        <div className="mx-auto mt-24 max-w-2xl border-t border-border px-6 pt-10">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Footnotes</h4>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><sup className="text-gold">1</sup> See Wilson, <em>Inverting the Pyramid</em>, ch. 14.</li>
            <li><sup className="text-gold">2</sup> Sacchi famously made his Milan players defend with no ball, against eleven imaginary opponents.</li>
            <li><sup className="text-gold">3</sup> The data point I find most compelling: pressing teams concede in the final 15 minutes at twice the rate of possession sides.</li>
          </ol>
        </div>

        {/* Author + CTA */}
        <div className="mx-auto mt-24 max-w-2xl px-6">
          <div className="flex items-start gap-5 border-y border-border py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border font-serif italic text-gold">K</div>
            <div className="flex-1">
              <div className="font-serif text-lg">{a.author}</div>
              <div className="text-sm text-muted-foreground">Founding editor. Writes about the things he can't stop thinking about.</div>
            </div>
            <button className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground underline-grow">Follow →</button>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="mx-auto mt-32 max-w-[1440px] px-6 lg:px-12">
        <div className="border-b border-border pb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">— Continue reading</div>
          <h3 className="mt-2 font-serif text-4xl font-light tracking-tight md:text-5xl">Adjacent essays</h3>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/article/$slug" params={{ slug: r.slug }} className="group block hover-lift">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={r.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-electric">{r.category}</div>
              <h4 className="mt-2 font-serif text-2xl leading-tight">{r.title}</h4>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.date}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
