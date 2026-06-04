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

  // Track the latest value in a ref so listeners can compare without triggering re-renders
  // or needing value in their dependency arrays.
  const valueRef = useRef(value);
  valueRef.current = value;

  // Track initialValue in a ref so we don't re-run effects if the caller passes a new literal.
  const initialValueRef = useRef(initialValue);

  const read = useCallback((): T => {
    if (typeof window === "undefined") return initialValueRef.current;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValueRef.current : (JSON.parse(raw) as T);
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  // Hydrate from storage after mount.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      const stored = read();
      // Only set if we actually have something in storage that differs from initialValue
      if (JSON.stringify(stored) !== JSON.stringify(initialValueRef.current)) {
        setValue(stored);
      }
      hydrated.current = true;
    }
  }, [read]);

  // Keep in sync when other tabs or hook instances change the same key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = (e: Event) => {
      // If it's a native storage event, check the key.
      if (e instanceof StorageEvent && e.key !== key) return;

      const latest = read();
      // Only update if the value in storage is different from our local state.
      if (JSON.stringify(latest) !== JSON.stringify(valueRef.current)) {
        setValue(latest);
      }
    };

    window.addEventListener("storage", sync);
    window.addEventListener("local-storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("local-storage", sync);
    };
  }, [key, read]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(valueRef.current) : next;

      // Update local state
      setValue(resolved);

      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
          // Notify other instances in this same tab.
          window.dispatchEvent(new Event("local-storage"));
        } catch {
          /* quota / private mode */
        }
      }
    },
    [key],
  );

  return [value, set];
}

