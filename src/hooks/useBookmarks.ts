import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "btb:bookmarks";

/**
 * Reading-list bookmarks, persisted to localStorage as an array of post slugs.
 * Most-recently-saved first. SSR-safe via {@link useLocalStorageState}.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorageState<string[]>(STORAGE_KEY, []);

  const isBookmarked = useCallback((slug: string) => bookmarks.includes(slug), [bookmarks]);

  const toggle = useCallback(
    (slug: string): boolean => {
      let added = false;
      setBookmarks((prev) => {
        if (prev.includes(slug)) return prev.filter((s) => s !== slug);
        added = true;
        return [slug, ...prev];
      });
      return added;
    },
    [setBookmarks],
  );

  const remove = useCallback(
    (slug: string) => setBookmarks((prev) => prev.filter((s) => s !== slug)),
    [setBookmarks],
  );

  return { bookmarks, isBookmarked, toggle, remove };
}
