import { Link } from "@tanstack/react-router";
import { Search, Command, Sun, Moon, Bookmark, Coffee, Menu } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { categoryCssVars, getCategoryStyle } from "@/lib/categoryStyle";
import { getAllCategoriesWithCounts } from "@/content/api.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = { onSearch: () => void };

const navCls =
  "relative font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground";

export function Header({ onSearch }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchMod, setSearchMod] = useState("Ctrl");
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const navCategories = getAllCategoriesWithCounts().filter((c) => c.count > 0);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    setSearchMod(mac ? "⌘" : "Ctrl");
  }, []);

  return (
    <header
      data-reading-chrome
      className={cn("sticky top-0 z-40 transition-all duration-500", scrolled ? "px-3 pt-2" : "")}
    >
      <div
        className={cn(
          "mx-auto max-w-[1440px] transition-all duration-500",
          scrolled
            ? "rounded-2xl border border-white/5 shadow-float glass-strong"
            : "bg-transparent",
          !scrolled && "px-6 lg:px-12",
          scrolled && "px-4 lg:px-6",
        )}
      >
        <div className="flex min-h-16 items-center justify-between gap-4 py-2">
          <Link to="/" className="group flex min-w-0 flex-col justify-center leading-none">
            <span className="font-serif text-xl tracking-tight sm:text-2xl">
              Beyond the Basics
            </span>
            <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
              Om's Blog
            </span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <NavItem to="/" exact>
              Index
            </NavItem>
            {navCategories.map((c) => (
              <NavCat key={c.slug} slug={c.slug}>
                {c.name}
              </NavCat>
            ))}
            <NavItem to="/about">About</NavItem>
          </nav>

          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-1.5">
              <IconTip label="Reading list">
                <Link
                  to="/reading-list"
                  aria-label="Reading list"
                  className="group relative hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:flex"
                  activeProps={{ className: "text-foreground" }}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {bookmarks.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold px-1 font-mono text-[9px] font-medium text-background">
                      {bookmarks.length}
                    </span>
                  )}
                </Link>
              </IconTip>
              <IconTip label={`Switch theme (current: ${theme})`}>
                <button
                  onClick={() => toggleTheme()}
                  aria-label={`Switch theme (current: ${theme})`}
                  className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Sun
                    className={`absolute h-3.5 w-3.5 transition-all duration-500 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
                  />
                  <Moon
                    className={`absolute h-3.5 w-3.5 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
                  />
                  <Coffee
                    className={`absolute h-3.5 w-3.5 transition-all duration-500 ${theme === "sepia" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
                  />
                </button>
              </IconTip>
              <IconTip label="Search">
                <button
                  onClick={onSearch}
                  className="group flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Open search"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Search</span>
                  <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-xs sm:flex">
                    {searchMod === "⌘" ? (
                      <>
                        <Command className="h-2.5 w-2.5" /> K
                      </>
                    ) : (
                      "Ctrl K"
                    )}
                  </kbd>
                </button>
              </IconTip>

              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[min(20rem,85vw)]">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-left text-xl font-light">
                      Beyond the Basics
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8 flex flex-col gap-1">
                    <MobileLink to="/start" onClick={() => setMenuOpen(false)}>
                      Start Here
                    </MobileLink>
                    <MobileLink to="/" exact onClick={() => setMenuOpen(false)}>
                      Index
                    </MobileLink>
                    {navCategories.map((c) => (
                      <Link
                        key={c.slug}
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        onClick={() => setMenuOpen(false)}
                        style={categoryCssVars(c.slug)}
                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                        activeProps={{ className: "text-foreground bg-secondary/60" }}
                      >
                        <span className="h-2 w-2 rounded-full bg-[var(--cat)]" />
                        {c.name}
                      </Link>
                    ))}
                    <MobileLink to="/archive" onClick={() => setMenuOpen(false)}>
                      Archive
                    </MobileLink>
                    <MobileLink to="/about" onClick={() => setMenuOpen(false)}>
                      About
                    </MobileLink>
                    <MobileLink to="/reading-list" onClick={() => setMenuOpen(false)}>
                      Reading list
                    </MobileLink>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}

function IconTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function NavItem({
  to,
  exact,
  children,
}: {
  to: "/" | "/about";
  exact?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(navCls, "group")}
      activeProps={{ className: "text-foreground" }}
      activeOptions={{ exact: !!exact }}
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 hidden h-1 w-1 -translate-x-1/2 rounded-full bg-gold group-data-[status=active]:block" />
    </Link>
  );
}

function NavCat({ slug, children }: { slug: string; children: ReactNode }) {
  const style = getCategoryStyle(slug);
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      style={categoryCssVars(slug)}
      className={cn(navCls, "group")}
      activeProps={{ className: "text-foreground" }}
    >
      {children}
      <span
        className="absolute -bottom-1 left-1/2 hidden h-1 w-1 -translate-x-1/2 rounded-full group-data-[status=active]:block"
        style={{ background: style.cssVar }}
      />
    </Link>
  );
}

function MobileLink({
  to,
  exact,
  onClick,
  children,
}: {
  to: "/" | "/about" | "/archive" | "/start" | "/reading-list";
  exact?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={{ exact: !!exact }}
      className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "text-foreground bg-secondary/60" }}
    >
      {children}
    </Link>
  );
}
