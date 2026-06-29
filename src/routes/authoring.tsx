import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { COMPONENT_REGISTRY } from "@/components/article/mdx/component-registry";
import type { ComponentMeta, PropDef } from "@/components/article/mdx/component-registry";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// @ts-expect-error route type generated on dev server start
export const Route = createFileRoute("/authoring")({
  head: () => ({
    meta: [
      { title: "Component Reference — Beyond the Basics" },
      { name: "description", content: "MDX component library for article authors." },
    ],
  }),
  component: Authoring,
});

type Category = ComponentMeta["category"] | "all";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "editorial", label: "Editorial" },
  { value: "layout", label: "Layout" },
  { value: "interactive", label: "Interactive" },
  { value: "media", label: "Media" },
  { value: "code", label: "Code" },
];

function PropRow({ prop }: { prop: PropDef }) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-2 pr-4 font-mono text-[11px] text-gold">{prop.name}</td>
      <td className="py-2 pr-4 font-mono text-[11px] text-electric/80">{prop.type}</td>
      <td className="py-2 pr-4 font-mono text-[11px] text-muted-foreground">
        {prop.required ? (
          <span className="text-destructive">required</span>
        ) : (
          prop.default ?? "—"
        )}
      </td>
      <td className="py-2 text-sm text-muted-foreground">{prop.description}</td>
    </tr>
  );
}

function ComponentCard({ meta }: { meta: ComponentMeta }) {
  const [propsOpen, setPropsOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  return (
    <article
      id={`component-${meta.name.toLowerCase()}`}
      className="rounded border border-border bg-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-2xl font-light text-foreground">{meta.name}</h2>
            {meta.deprecated && (
              <span className="rounded bg-destructive/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-destructive">
                Deprecated
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {meta.mdxTags.map((tag) => (
              <code
                key={tag}
                className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-gold"
              >
                {`<${tag}>`}
              </code>
            ))}
            <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {meta.category}
            </span>
            <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60">
              v{meta.versionIntroduced}
            </span>
          </div>
        </div>
      </div>

      {/* Deprecation banner */}
      {meta.deprecated && meta.deprecationMessage && (
        <div className="rounded-r border-l-4 border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {meta.deprecationMessage}
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">{meta.description}</p>

      {/* Props table */}
      {meta.props.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setPropsOpen((o) => !o)}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={cn("h-3 w-3 transition-transform duration-200", propsOpen && "rotate-180")}
              aria-hidden
            />
            Props ({meta.props.length})
          </button>
          {propsOpen && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[500px] text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Name
                    </th>
                    <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Type
                    </th>
                    <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Default
                    </th>
                    <th className="pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meta.props.map((p) => (
                    <PropRow key={p.name} prop={p} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      {meta.examples.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Examples
          </p>
          {meta.examples.map((ex) => (
            <div key={ex.label}>
              <p className="mb-1.5 font-mono text-[10px] text-muted-foreground/60">{ex.label}</p>
              <pre className="overflow-x-auto rounded border border-border bg-secondary px-4 py-3 font-mono text-[12px] leading-relaxed text-foreground/80">
                {ex.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Accessibility notes */}
      <div>
        <button
          type="button"
          onClick={() => setA11yOpen((o) => !o)}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn("h-3 w-3 transition-transform duration-200", a11yOpen && "rotate-180")}
            aria-hidden
          />
          Accessibility
        </button>
        {a11yOpen && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {meta.accessibilityNotes}
          </p>
        )}
      </div>
    </article>
  );
}

function Authoring() {
  const [category, setCategory] = useState<Category>("all");
  const filtered =
    category === "all"
      ? COMPONENT_REGISTRY
      : COMPONENT_REGISTRY.filter((c) => c.category === category);

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-24 lg:px-12 lg:pt-36">
        {/* Page header */}
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — Author Tools
        </div>
        <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-none tracking-tight">
          Component Reference
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Named MDX components available in every article. No imports needed — just use the JSX
          tags.
        </p>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                "rounded border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                category === value
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Component grid */}
        <div className="mt-10 space-y-6">
          {filtered.map((meta) => (
            <ComponentCard key={meta.name} meta={meta} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-16 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
          To add a new component — create the file, export from{" "}
          <code className="text-gold">src/components/article/mdx/index.ts</code>, register in{" "}
          <code className="text-gold">mdx-components.tsx</code>, and add an entry to{" "}
          <code className="text-gold">component-registry.ts</code>.
        </p>
      </div>
    </SiteShell>
  );
}
