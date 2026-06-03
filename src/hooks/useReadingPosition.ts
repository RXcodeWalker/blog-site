import { useCallback, useEffect, useRef, useState } from "react";

const keyFor = (slug: string) => `btb:pos:${slug}`;
/** Don't bother offering to resume unless the reader got meaningfully into the article. */
const MIN_RESUME_PERCENT = 8;
/** ...nor when they essentially finished it. */
const MAX_RESUME_PERCENT = 92;

/**
 * Remembers how far the reader scrolled through a given article (as a document percentage)
 * and, on return, exposes a saved position so the UI can offer "resume where you left off".
 *
 * The position is saved continuously (throttled via rAF); resuming is opt-in — the caller
 * decides whether to act on `savedPercent` and then calls `resume()` / `dismiss()`.
 */
export function useReadingPosition(slug: string) {
  const [savedPercent, setSavedPercent] = useState<number | null>(null);
  const ticking = useRef(false);

  // Read any stored position once on mount / slug change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let pct: number | null = null;
    try {
      const raw = window.localStorage.getItem(keyFor(slug));
      if (raw !== null) pct = Number(raw);
    } catch {
      /* ignore */
    }
    setSavedPercent(
      pct !== null && pct >= MIN_RESUME_PERCENT && pct <= MAX_RESUME_PERCENT ? pct : null,
    );
  }, [slug]);

  // Continuously persist the current scroll position.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
        try {
          window.localStorage.setItem(keyFor(slug), pct.toFixed(1));
        } catch {
          /* ignore */
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  /** Scroll to the saved position and clear the resume prompt. */
  const resume = useCallback(() => {
    if (savedPercent === null || typeof window === "undefined") return;
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    window.scrollTo({ top: (savedPercent / 100) * total, behavior: "smooth" });
    setSavedPercent(null);
  }, [savedPercent]);

  /** Dismiss the resume prompt without scrolling. */
  const dismiss = useCallback(() => setSavedPercent(null), []);

  return { savedPercent, resume, dismiss };
}
