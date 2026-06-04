import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light" | "sepia";
type Ctx = { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "btb-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Initialise from storage / system once mounted
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const system: Theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    setThemeState(stored ?? system);
  }, []);

  // Apply class to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    // Mirror the theme on a data attribute for easier debugging and CSS hooks
    try {
      root.setAttribute("data-theme", theme);
    } catch {}
    // Debug log so users can see toggles in the browser console
    try {
      // eslint-disable-next-line no-console
      console.debug("Theme applied:", theme);
    } catch {}
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const value: Ctx = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () =>
      setThemeState((t) => {
        const next: Theme = t === "dark" ? "light" : t === "light" ? "sepia" : "dark";
        try {
          // eslint-disable-next-line no-console
          console.debug("Theme toggle:", t, "->", next);
        } catch {}
        return next;
      }),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
