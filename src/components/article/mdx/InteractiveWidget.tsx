import { Suspense, Component } from "react";
import type { ReactNode } from "react";
import { WIDGET_RUNTIME } from "./widget-runtime";

interface WidgetErrorBoundaryState {
  error: Error | null;
}

class WidgetErrorBoundary extends Component<
  { name: string; children: ReactNode },
  WidgetErrorBoundaryState
> {
  state: WidgetErrorBoundaryState = { error: null };

  static getDerivedStateFromError(e: Error): WidgetErrorBoundaryState {
    return { error: e };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="my-6 rounded border border-destructive/40 bg-destructive/5 p-4 font-mono text-sm text-destructive"
        >
          <p>Widget &quot;{this.props.name}&quot; failed to render.</p>
          {(import.meta as { env?: { DEV?: boolean } }).env?.DEV && (
            <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

interface InteractiveWidgetProps {
  name: string;
  [prop: string]: unknown;
}

export function InteractiveWidget({ name, ...props }: InteractiveWidgetProps) {
  const Widget = WIDGET_RUNTIME[name];

  if (!Widget) {
    return (
      <div
        role="alert"
        className="my-6 rounded border border-destructive/40 bg-destructive/5 p-4 font-mono text-sm text-destructive"
      >
        Unknown widget: &quot;{name}&quot;. Available widgets:{" "}
        {Object.keys(WIDGET_RUNTIME).join(", ") || "none"}.
      </div>
    );
  }

  return (
    <WidgetErrorBoundary name={name}>
      <div className="my-6 overflow-hidden rounded border border-border">
        <Suspense
          fallback={
            <div
              aria-hidden
              className="flex h-24 items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50"
            >
              Loading…
            </div>
          }
        >
          <Widget {...(props as Record<string, unknown>)} />
        </Suspense>
      </div>
    </WidgetErrorBoundary>
  );
}
