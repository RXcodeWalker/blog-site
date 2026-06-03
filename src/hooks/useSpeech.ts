import { useCallback, useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setState("idle");
  }, []);

  // Stop speech if the component unmounts (e.g. navigating away).
  useEffect(() => () => synthRef.current?.cancel(), []);

  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.cancel();

    const chunks = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g) ?? [text];

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.rate = 1;
      if (i === chunks.length - 1) {
        utterance.onend = () => setState("idle");
      }
      synth.speak(utterance);
    });
    setState("playing");
  }, []);

  const toggle = useCallback(
    (getText: () => string) => {
      const synth = synthRef.current;
      if (!synth) return;
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
