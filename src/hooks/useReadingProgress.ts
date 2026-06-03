import { useEffect, useState } from "react";
import type { TocHeading } from "@/content/types";

interface ReadingProgress {
  /** Scroll-through percentage of the document, 0–100. */
  progress: number;
  /** Estimated minutes of reading left, derived from progress and total reading time. */
  minutesLeft: number;
  /** The id of the heading currently nearest the top of the viewport, or null. */
  activeHeadingId: string | null;
}

/**
 * Tracks scroll progress through the article, the estimated time remaining, and which
 * heading is currently in view (for table-of-contents highlighting).
 */
export function useReadingProgress(
  readingTimeMinutes: number,
  headings: TocHeading[],
): ReadingProgress {
  const [progress, setProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // Track which headings are above the trigger line; the last one wins.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Pick the first heading (in document order) that is currently visible.
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) setActiveHeadingId(firstVisible.id);
      },
      // Bias the active zone toward the upper portion of the viewport.
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const minutesLeft = Math.max(0, Math.ceil((readingTimeMinutes * (100 - progress)) / 100));

  return { progress, minutesLeft, activeHeadingId };
}
