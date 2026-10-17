import { Link } from "@tanstack/react-router";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import { getAllCategoriesWithCounts } from "@/content/api.ts";

export function Footer() {
  const { email, setEmail, status, handleSubmit } = useNewsletterSubscription("footer");
  const sections = getAllCategoriesWithCounts().filter((c) => c.count > 0);

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--electric)_12%,transparent),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl leading-[1.08] tracking-tight md:text-4xl">
              A student blog on <em className="text-gold">Arsenal, code, and growth</em>.
            </p>
            <form className="mt-8 flex max-w-md items-center gap-0" onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@inbox.com"
                disabled={status === "loading" || status === "success"}
                className="flex-1 rounded-l-full border border-border bg-secondary/40 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="rounded-r-full border border-l-0 border-border bg-foreground px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "..." : status === "success" ? "Check inbox" : "Subscribe"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Sections
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {sections.map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="underline-grow">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Editorial
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/start" className="underline-grow">
                  Start Here
                </Link>
              </li>
              <li>
                <Link to="/archive" className="underline-grow">
                  Archive
                </Link>
              </li>
              <li>
                <Link to="/about" className="underline-grow">
                  About
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="underline-grow">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Index
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="underline-grow" href="/rss.xml">
                  RSS
                </a>
              </li>
              <li>
                <a className="underline-grow" href="/feeds">
                  All Feeds
                </a>
              </li>
              <li>
                <a className="underline-grow" href="mailto:hello@beyondthebasics.me">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="editorial-rule mt-10" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>© 2026 Beyond the Basics by Om Jhamvar.</span>
          <span>Built in public. Learning every day.</span>
        </div>
      </div>
    </footer>
  );
}
