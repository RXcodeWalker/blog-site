import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "btb:bookmarks";

/**
 * Reading-list bookmarks, persisted to localStorage as an array of post slugs.
 * Most-recently-saved first. SSR-safe via {@link useLocalStorageState}.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorageState<string[]>(STORAGE_KEY, []);

  const isBookmarked = useCallback(
    (slug: string) => Array.isArray(bookmarks) && bookmarks.includes(slug),
    [bookmarks],
  );

  const toggle = useCallback(
    (slug: string) => {
      setBookmarks((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.includes(slug) ? safePrev.filter((s) => s !== slug) : [slug, ...safePrev];
      });
    },
    [setBookmarks],
  );

  const remove = useCallback(
    (slug: string) => {
      setBookmarks((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.filter((s) => s !== slug);
      });
    },
    [setBookmarks],
  );

  return { bookmarks: Array.isArray(bookmarks) ? bookmarks : [], isBookmarked, toggle, remove };
}
