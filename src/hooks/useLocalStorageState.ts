import { useCallback, useEffect, useRef, useState } from "react";

/**
 * SSR-safe localStorage-backed state.
 *
 * Renders `initialValue` on the server and the first client paint (avoiding hydration
 * mismatches), then hydrates from localStorage in an effect. Writes are persisted as JSON
 * and synced across tabs/components via the native `storage` event plus a same-tab custom event.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);
  // Track the latest value so the cross-tab listener can read it without re-subscribing.
  const valueRef = useRef(value);
  valueRef.current = value;

  const read = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
    // initialValue is intentionally read once; callers pass stable values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Hydrate from storage after mount.
  useEffect(() => {
    setValue(read());
  }, [read]);

  // Keep in sync when other tabs or hook instances change the same key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setValue(read());
    window.addEventListener("storage", sync);
    window.addEventListener("local-storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("local-storage", sync);
    };
  }, [read]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
            // Notify other instances in this same tab (storage event only fires cross-tab).
            window.dispatchEvent(new Event("local-storage"));
          } catch {
            /* quota / private mode — keep in-memory value */
          }
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
