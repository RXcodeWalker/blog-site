import { Link } from "@tanstack/react-router";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

export function Footer() {
  const { email, setEmail, status, handleSubmit } = useNewsletterSubscription("footer");

  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl">
              A student blog on <em className="text-gold">Arsenal, code, and growth</em>.
            </p>
            <form className="mt-8 flex max-w-md gap-2" onSubmit={handleSubmit}>
              {/* honeypot — bots fill this, humans don't */}
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
                className="flex-1 border-b border-border bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              >
                {status === "loading" ? "..." : status === "success" ? "Check inbox →" : "Subscribe →"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Sections
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/category/$slug" params={{ slug: "football" }} className="underline-grow">
                  Football
                </Link>
              </li>
              <li>
                <Link to="/category/$slug" params={{ slug: "mindset" }} className="underline-grow">
                  Mindset
                </Link>
              </li>
              <li>
                <Link to="/category/$slug" params={{ slug: "learning" }} className="underline-grow">
                  Learning
                </Link>
              </li>
              <li>
                <Link to="/category/$slug" params={{ slug: "building" }} className="underline-grow">
                  Building
                </Link>
              </li>
              <li>
                <Link to="/category/$slug" params={{ slug: "journal" }} className="underline-grow">
                  Journal
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Editorial
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="underline-grow">
                  About
                </Link>
              </li>
              <li>
                <a className="underline-grow" href="#">
                  Colophon
                </a>
              </li>
              <li>
                <Link to="/newsletter" className="underline-grow">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Index
            </h4>
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
                <a className="underline-grow" href="https://x.com" target="_blank" rel="noreferrer">
                  X / Twitter
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

        <div className="editorial-rule mt-16" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>© 2026 Beyond the Basics by Om Jhamvar.</span>
          <span>Built in public. Learning every day.</span>
        </div>
      </div>
    </footer>
  );
}
