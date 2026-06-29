import type { ReactNode } from "react";
import { Children } from "react";
import { cn } from "@/lib/utils";

interface ComparisonColumnProps {
  children: ReactNode;
  label?: string;
  accent?: "gold" | "electric" | "none";
}

function ComparisonColumn({ children, label, accent = "none" }: ComparisonColumnProps) {
  const accentClass =
    accent === "gold"
      ? "text-gold"
      : accent === "electric"
      ? "text-electric"
      : "text-muted-foreground";
  return (
    <div role="listitem" aria-label={label} className="min-w-0 flex-1 px-5 py-4">
      {label && (
        <p
          className={cn(
            "mb-3 font-mono text-[10px] uppercase tracking-[0.18em]",
            accentClass
          )}
        >
          {label}
        </p>
      )}
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}

interface ComparisonBlockProps {
  labels?: string[];
  accent?: "gold" | "electric" | "none";
  children: ReactNode;
  id?: string;
}

function ComparisonBlockRoot({
  labels = ["Before", "After"],
  accent = "none",
  children,
  id,
}: ComparisonBlockProps) {
  const cols = Children.toArray(children);
  return (
    <div
      id={id}
      className="my-10 overflow-hidden rounded border border-border"
    >
      <div role="list" className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
        {cols.map((col, i) => {
          if (!col) return null;
          const label = labels[i] ?? `Column ${i + 1}`;
          // Clone to inject label + accent
          if (typeof col === "object" && col !== null && "props" in (col as object)) {
            const el = col as React.ReactElement<{ children?: ReactNode }>;
            return (
              <ComparisonColumn key={i} label={label} accent={accent}>
                {el.props.children}
              </ComparisonColumn>
            );
          }
          return (
            <ComparisonColumn key={i} label={label} accent={accent}>
              {col}
            </ComparisonColumn>
          );
        })}
      </div>
    </div>
  );
}

export const ComparisonBlock = Object.assign(ComparisonBlockRoot, {
  Column: ComparisonColumn,
});

// Named export for mdx-components mapping
export { ComparisonColumn };
