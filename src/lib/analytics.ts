declare global {
  interface Window {
    umami?: {
      track: (event: string, props?: Record<string, string | number>) => void;
    };
  }
}

export function track(event: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined" || !window.umami) return;
  window.umami.track(event, props);
}
