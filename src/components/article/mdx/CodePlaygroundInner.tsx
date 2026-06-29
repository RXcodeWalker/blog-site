import { memo, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import type { SandpackTheme } from "@codesandbox/sandpack-react";

type SandpackTemplate = "react" | "react-ts" | "vanilla" | "vanilla-ts";
import { RotateCcw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function getThemeMode(): "dark" | "light" {
  const root = document.documentElement;
  if (root.classList.contains("light")) return "light";
  if (root.classList.contains("sepia")) return "light";
  return "dark";
}

const DARK_THEME: SandpackTheme = {
  colors: {
    surface1: "oklch(0.17 0.006 260)",
    surface2: "oklch(0.22 0.008 260)",
    surface3: "oklch(0.24 0.01 260)",
    clickable: "oklch(0.62 0.012 260)",
    base: "oklch(0.94 0.01 80)",
    disabled: "oklch(0.4 0.008 260)",
    hover: "oklch(0.72 0.18 245)",
    accent: "oklch(0.72 0.18 245)",
    error: "oklch(0.6 0.22 25)",
    errorSurface: "oklch(0.2 0.05 25)",
  },
  syntax: {
    plain: "oklch(0.94 0.01 80)",
    comment: { color: "oklch(0.55 0.012 260)", fontStyle: "italic" },
    keyword: "oklch(0.72 0.18 245)",
    tag: "oklch(0.78 0.12 75)",
    punctuation: "oklch(0.7 0.012 260)",
    definition: "oklch(0.78 0.12 75)",
    property: "oklch(0.72 0.18 245)",
    static: "oklch(0.78 0.15 150)",
    string: "oklch(0.78 0.15 150)",
  },
  font: {
    body: '"JetBrains Mono", ui-monospace, monospace',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

const LIGHT_THEME: SandpackTheme = {
  colors: {
    surface1: "oklch(0.98 0.005 80)",
    surface2: "oklch(0.94 0.005 80)",
    surface3: "oklch(0.92 0.005 80)",
    clickable: "#444444",
    base: "#000000",
    disabled: "#888",
    hover: "oklch(0.5 0.18 245)",
    accent: "oklch(0.5 0.18 245)",
    error: "oklch(0.5 0.22 25)",
    errorSurface: "oklch(0.95 0.03 25)",
  },
  syntax: {
    plain: "#000000",
    comment: { color: "#888", fontStyle: "italic" },
    keyword: "oklch(0.5 0.18 245)",
    tag: "oklch(0.62 0.13 75)",
    punctuation: "#555",
    definition: "oklch(0.62 0.13 75)",
    property: "oklch(0.5 0.18 245)",
    static: "oklch(0.4 0.15 150)",
    string: "oklch(0.4 0.15 150)",
  },
  font: {
    body: '"JetBrains Mono", ui-monospace, monospace',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

function Toolbar({
  showReset,
  showCopyAll,
}: {
  showReset: boolean;
  showCopyAll: boolean;
}) {
  const { sandpack } = useSandpack();
  const [copied, setCopied] = useState(false);
  const isDirty = Object.values(sandpack.files).some((f) => f.code !== sandpack.files[f.code]?.code);

  const handleReset = () => sandpack.resetAllFiles();

  const handleCopyAll = async () => {
    const payload = JSON.stringify(
      Object.fromEntries(Object.entries(sandpack.files).map(([k, v]) => [k, v.code])),
      null,
      2
    );
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showReset && !showCopyAll) return null;

  return (
    <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-1.5">
      {showReset && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Reset all files to original"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          Reset
        </button>
      )}
      {showCopyAll && (
        <button
          type="button"
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy all files to clipboard"
        >
          {copied ? (
            <Check className="h-3 w-3 text-gold" aria-hidden />
          ) : (
            <Copy className="h-3 w-3" aria-hidden />
          )}
          {copied ? "Copied" : "Copy All"}
        </button>
      )}
    </div>
  );
}

interface CodePlaygroundInnerProps {
  template: SandpackTemplate;
  files?: Record<string, string>;
  entry: string;
  height: number;
  showConsole: boolean;
  showReset: boolean;
  showCopyAll: boolean;
  code: string;
}

function Inner({
  template,
  files,
  entry,
  height,
  showConsole,
  showReset,
  showCopyAll,
  code,
}: CodePlaygroundInnerProps) {
  const [mode, setMode] = useState<"dark" | "light">(getThemeMode);

  useEffect(() => {
    const observer = new MutationObserver(() => setMode(getThemeMode()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const sandpackFiles = files ?? { [entry]: code };

  return (
    <SandpackProvider
      template={template}
      files={sandpackFiles}
      theme={mode === "light" ? LIGHT_THEME : DARK_THEME}
    >
      <div className="overflow-hidden rounded border border-border">
        <Toolbar showReset={showReset} showCopyAll={showCopyAll} />
        <SandpackLayout>
          <SandpackCodeEditor style={{ height }} />
          <div role="region" aria-label="Live code preview">
            <SandpackPreview style={{ height }} />
          </div>
        </SandpackLayout>
        {showConsole && <SandpackConsole />}
      </div>
    </SandpackProvider>
  );
}

export default memo(Inner);
