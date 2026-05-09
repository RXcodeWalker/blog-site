import { Link } from "@tanstack/react-router";
import { Search, Command } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { onSearch: () => void };

export function Header({ onSearch }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled ? "glass-strong border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-baseline gap-3">
            <span className="font-serif text-xl tracking-tight">Beyond&nbsp;the&nbsp;Basics</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              / Vol. 04
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavItem to="/" exact>Index</NavItem>
            <NavCat slug="football">Football</NavCat>
            <NavCat slug="technology">Technology</NavCat>
            <NavCat slug="philosophy">Philosophy</NavCat>
            <NavItem to="/about">Theory</NavItem>
          </nav>

          <button
            onClick={onSearch}
            className="group flex items-center gap-3 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Open search"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] sm:flex">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}

const navCls = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground underline-grow";

function NavItem({ to, exact, children }: { to: "/" | "/about"; exact?: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={navCls} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: !!exact }}>
      {children}
    </Link>
  );
}

function NavCat({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link to="/category/$slug" params={{ slug }} className={navCls} activeProps={{ className: "text-foreground" }}>
      {children}
    </Link>
  );
}
