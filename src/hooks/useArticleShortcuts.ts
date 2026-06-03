import { useEffect, useRef } from "react";

type Handlers = {
  onBookmark: () => void;
  onToggleFocus: () => void;
  onToggleToc: () => void;
  onToggleHelp: () => void;
};

const isTypingTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
};

/**
 * Keyboard shortcuts for the article view. Mount this only on the article route so the
 * bindings are naturally scoped. Ignores keystrokes while typing in form fields.
 *
 *   j / k  scroll down / up by ~85% of the viewport
 *   t      toggle the table of contents
 *   b      bookmark / unbookmark
 *   f      toggle focus mode
 *   ?      show the shortcuts help
 */
export function useArticleShortcuts(handlers: Handlers) {
  // Keep the latest handlers in a ref so the listener binds once.
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      const step = Math.round(window.innerHeight * 0.85);
      switch (e.key) {
        case "j":
          window.scrollBy({ top: step, behavior: "smooth" });
          break;
        case "k":
          window.scrollBy({ top: -step, behavior: "smooth" });
          break;
        case "t":
          ref.current.onToggleToc();
          break;
        case "b":
          ref.current.onBookmark();
          break;
        case "f":
          ref.current.onToggleFocus();
          break;
        case "?":
          ref.current.onToggleHelp();
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
