import { Suspense, lazy } from "react";
type SandpackTemplate = "react" | "react-ts" | "vanilla" | "vanilla-ts";

const CodePlaygroundInner = lazy(() => import("./CodePlaygroundInner"));

interface CodePlaygroundProps {
  template?: SandpackTemplate;
  files?: Record<string, string>;
  entry?: string;
  height?: number;
  showConsole?: boolean;
  showReset?: boolean;
  showCopyAll?: boolean;
  children?: string;
}

export function CodePlayground({
  template = "react-ts",
  files,
  entry = "/App.tsx",
  height = 400,
  showConsole = false,
  showReset = true,
  showCopyAll = true,
  children = "",
}: CodePlaygroundProps) {
  return (
    <div className="my-8">
      <Suspense
        fallback={
          <div
            aria-hidden
            className="flex items-center justify-center rounded border border-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50"
            style={{ height }}
          >
            Loading playground…
          </div>
        }
      >
        <CodePlaygroundInner
          template={template}
          files={files}
          entry={entry}
          height={height}
          showConsole={showConsole}
          showReset={showReset}
          showCopyAll={showCopyAll}
          code={children}
        />
      </Suspense>
    </div>
  );
}
