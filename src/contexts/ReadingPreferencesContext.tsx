import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ReadingFont = "serif" | "sans" | "mono" | "dyslexic";
export type ReadingSize = "sm" | "base" | "lg" | "xl";
export type ReadingLineHeight = "tight" | "base" | "relaxed";

type ReadingPreferences = {
  font: ReadingFont;
  size: ReadingSize;
  lineHeight: ReadingLineHeight;
};

type Ctx = ReadingPreferences & {
  setFont: (f: ReadingFont) => void;
  setSize: (s: ReadingSize) => void;
  setLineHeight: (lh: ReadingLineHeight) => void;
};

const ReadingPreferencesContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "btb-reading-prefs";

const DEFAULTS: ReadingPreferences = {
  font: "serif",
  size: "base",
  lineHeight: "base",
};

export function ReadingPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ReadingPreferences>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse reading preferences", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-reading-font", prefs.font);
    root.setAttribute("data-reading-size", prefs.size);
    root.setAttribute("data-reading-lh", prefs.lineHeight);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs, mounted]);

  const value: Ctx = {
    ...prefs,
    setFont: (font) => setPrefs((p) => ({ ...p, font })),
    setSize: (size) => setPrefs((p) => ({ ...p, size })),
    setLineHeight: (lineHeight) => setPrefs((p) => ({ ...p, lineHeight })),
  };

  return (
    <ReadingPreferencesContext.Provider value={value}>
      {children}
    </ReadingPreferencesContext.Provider>
  );
}

export function useReadingPreferences() {
  const ctx = useContext(ReadingPreferencesContext);
  if (!ctx) throw new Error("useReadingPreferences must be used within ReadingPreferencesProvider");
  return ctx;
}
