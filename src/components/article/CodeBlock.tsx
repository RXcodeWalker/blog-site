import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/share";

/**
 * Wraps a syntax-highlighted `<pre>` (produced by rehype-pretty-code) with a copy-to-clipboard
 * button that appears on hover. Reads the rendered text so it copies the code, not the markup.
 */
export function CodeBlock({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const pre = preRef.current;
    if (!pre) return;
    // rehype-pretty-code wraps each line in an inline `[data-line]` span, so `textContent`
    // alone would collapse newlines. Join the lines explicitly to preserve formatting.
    const lines = pre.querySelectorAll("[data-line]");
    const text =
      lines.length > 0
        ? Array.from(lines, (l) => l.textContent ?? "").join("\n")
        : (pre.textContent ?? "");
    if (!text) return;
    try {
      await copyToClipboard(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="group relative my-8">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition-all hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded bg-secondary p-6 font-mono text-sm leading-relaxed"
        {...rest}
      >
        {children}
      </pre>
    </div>
  );
}
