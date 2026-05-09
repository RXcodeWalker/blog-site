import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl">
              A digital publication for those <em className="text-gold">not satisfied</em> with the basics.
            </p>
            <form className="mt-8 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@inbox.com"
                className="flex-1 border-b border-border bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
              <button className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                Subscribe →
              </button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Sections</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/category/football" className="underline-grow">Football</Link></li>
              <li><Link to="/category/technology" className="underline-grow">Technology</Link></li>
              <li><Link to="/category/philosophy" className="underline-grow">Philosophy</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Editorial</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="underline-grow">Theory</Link></li>
              <li><a className="underline-grow" href="#">Colophon</a></li>
              <li><a className="underline-grow" href="#">Archive</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Index</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="underline-grow" href="#">RSS</a></li>
              <li><a className="underline-grow" href="#">X / Twitter</a></li>
              <li><a className="underline-grow" href="#">Letters</a></li>
            </ul>
          </div>
        </div>

        <div className="editorial-rule mt-16" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>© 2026 Beyond the Basics. All rights reserved.</span>
          <span>Set in Fraunces & Inter. Made with intention.</span>
        </div>
      </div>
    </footer>
  );
}
