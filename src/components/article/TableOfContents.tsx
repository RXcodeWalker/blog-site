import type { TocHeading } from "@/content/types";

type Props = {
  headings: TocHeading[];
  activeId: string | null;
  /** Optional callback after a link is clicked (e.g. to close a mobile drawer). */
  onNavigate?: () => void;
};

/**
 * Table of contents built from the post's headings. Highlights the section currently in view
 * and smooth-scrolls on click (html has `scroll-behavior: smooth`). Renders nothing for posts
 * with fewer than two headings.
 */
export function TableOfContents({ headings, activeId, onNavigate }: Props) {
  if (headings.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    onNavigate?.();
  };

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        On this page
      </div>
      <ul className="flex flex-col gap-1 border-l border-border">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={`-ml-px block border-l py-1 text-sm leading-snug transition-colors ${
                  h.depth === 3 ? "pl-6" : "pl-4"
                } ${
                  active
                    ? "border-gold text-gold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
