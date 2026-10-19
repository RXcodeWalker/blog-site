import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";

type SpeechState = "idle" | "playing" | "paused";

/**
 * Thin wrapper around the Web Speech API (`speechSynthesis`) for reading article text aloud.
 * Long text is split into sentence-sized chunks and queued so it survives browser length limits.
 * `supported` is false (and controls are no-ops) where the API is unavailable.
 */
export function useSpeech() {
  const [state, setState] = useState<SpeechState>("idle");
  const [supported, setSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    setState("idle");
  }, []);

  // Stop speech if route or pathname changes (e.g. clicking a link to another post)
  useEffect(() => {
    stop();
  }, [location.pathname, stop]);

  // Stop speech if the component unmounts (e.g. navigating away).
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Also stop if window unloads or page hides
  useEffect(() => {
    const handleUnload = () => {
      stop();
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [stop]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    try {
      if (synth.paused) {
        synth.resume();
      }
      synth.cancel();
    } catch {
      // ignore
    }

    const chunks = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g) ?? [text];

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.rate = 1;
      if (i === chunks.length - 1) {
        utterance.onend = () => setState("idle");
      }
      utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          setState("idle");
        }
      };
      synth.speak(utterance);
    });
    setState("playing");
  }, []);

  const toggle = useCallback(
    (getText: () => string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      if (state === "playing") {
        synth.pause();
        setState("paused");
      } else if (state === "paused") {
        synth.resume();
        setState("playing");
      } else {
        speak(getText());
      }
    },
    [state, speak],
  );

  return { state, supported, toggle, stop };
}
