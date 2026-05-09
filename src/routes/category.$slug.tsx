import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { articles, categories } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const c = categories.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Beyond the Basics` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.name} — Beyond the Basics` },
          { property: "og:description", content: loaderData.desc },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell><div className="mx-auto max-w-2xl px-6 py-40 text-center"><h1 className="font-serif text-5xl">Section not found</h1></div></SiteShell>
  ),
  errorComponent: ({ error }) => (<SiteShell><div className="mx-auto max-w-2xl px-6 py-40 text-center">{error.message}</div></SiteShell>),
  component: Category,
});

function Category() {
  const c = Route.useLoaderData();
  // build a list — pad with reused articles for visual density
  const items = [
    ...articles.filter((a) => a.category.toLowerCase() === c.name.toLowerCase()),
    ...articles,
  ].slice(0, 8);

  return (
    <SiteShell>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ background: `radial-gradient(ellipse at top left, oklch(0.6 0.18 ${c.accent.split(" ")[0]} / 0.5), transparent 60%)` }}
        />
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Index</Link>
            <span>/</span>
            <span className="text-foreground">Section</span>
            <span>/</span>
            <span className="text-gold">{c.name}</span>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">— Section {String(categories.indexOf(c) + 1).padStart(2, "0")}</div>
              <h1 className="mt-6 font-serif text-[clamp(3rem,10vw,9rem)] font-light leading-[0.9] tracking-[-0.03em] text-balance">
                {c.name}
              </h1>
            </div>
            <div className="md:col-span-4 md:pt-12">
              <p className="font-serif text-xl italic leading-relaxed text-muted-foreground text-pretty">{c.desc}</p>
              <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.count} entries · Updated weekly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-6 py-4 lg:px-12 font-mono text-[11px] uppercase tracking-[0.18em]">
          {["All", "Essays", "Analysis", "Notes", "Series"].map((t, i) => (
            <button
              key={t}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 transition-colors ${i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto hidden whitespace-nowrap text-muted-foreground md:inline">Sorted by recency ↓</span>
        </div>
      </section>

      {/* List */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
        <ol className="divide-y divide-border">
          {items.map((a, i) => (
            <li key={`${a.slug}-${i}`}>
              <Link
                to="/article/$slug"
                params={{ slug: a.slug }}
                className="group grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">{a.tag} · {a.date}</div>
                  <h3 className="mt-2 font-serif text-3xl font-light leading-tight tracking-tight transition-colors group-hover:text-gold md:text-4xl">
                    {a.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-muted-foreground">{a.dek}</p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden md:col-span-3">
                  <img src={a.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="flex items-start justify-end md:col-span-1">
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
