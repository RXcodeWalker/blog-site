import { useEffect, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SearchOverlay } from "./SearchOverlay";

export function SiteShell({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header onSearch={() => setSearch(true)} />
      <main>{children}</main>
      <Footer />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
