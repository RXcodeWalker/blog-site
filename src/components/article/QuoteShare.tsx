import { useCallback, useEffect, useRef, useState } from "react";
import { Share2, Quote } from "lucide-react";
import { shareOrCopy, copyToClipboard } from "@/lib/share";
import { toast } from "sonner";

type Props = {
  /** Ref to the article body; selections outside it are ignored. */
  containerRef: React.RefObject<HTMLElement | null>;
  title: string;
};

type Anchor = { top: number; left: number; text: string };

/**
 * Medium-style highlight-to-share. When the reader selects text inside the article body, a
 * small floating toolbar appears above the selection with "Share quote" and "Copy" actions.
 */
export function QuoteShare({ containerRef, title }: Props) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const clear = useCallback(() => setAnchor(null), []);

  useEffect(() => {
    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setAnchor(null);
        return;
      }
      const text = selection.toString().trim();
      const container = containerRef.current;
      if (text.length < 8 || !container) {
        setAnchor(null);
        return;
      }
      const range = selection.getRangeAt(0);
      // Only react to selections that live inside the article body.
      if (!container.contains(range.commonAncestorContainer)) {
        setAnchor(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      // Viewport coordinates — paired with `position: fixed` so it's immune to any
      // positioned ancestor. The toolbar is dismissed on scroll, so fixed is fine.
      setAnchor({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
        text,
      });
    };

    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", clear);
    };
  }, [containerRef, clear]);

  if (!anchor) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const quoted = `"${anchor.text}" — ${title}`;

  const handleShare = async () => {
    const outcome = await shareOrCopy({ title, text: quoted, url }, `${quoted}\n${url}`);
    if (outcome === "copied") toast.success("Quote copied");
    else if (outcome === "error") toast.error("Couldn't share quote");
    clear();
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(`${quoted}\n${url}`);
      toast.success("Quote copied");
    } catch {
      toast.error("Couldn't copy quote");
    }
    clear();
  };

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label="Share selected quote"
      style={{ top: anchor.top, left: anchor.left }}
      className="glass-strong fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full border border-border p-1 shadow-editorial"
      // Keep the selection alive when interacting with the toolbar.
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
      >
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
      <span className="h-4 w-px bg-border" />
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy quote"
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
      >
        <Quote className="h-3.5 w-3.5" /> Copy
      </button>
    </div>
  );
}
