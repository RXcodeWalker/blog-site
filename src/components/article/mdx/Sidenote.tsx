import type { ReactNode } from "react";
import { useId } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidenoteProps {
  children: ReactNode;
  label?: string;
  id?: string;
}

export function Sidenote({ children, label = "Note", id }: SidenoteProps) {
  const contentId = useId();

  return (
    <>
      {/* Desktop: float into right gutter */}
      <aside
        id={id}
        aria-label={label}
        className={cn(
          // hidden on mobile — shown via collapsible below
          "hidden lg:block",
          "float-right clear-right w-[200px] ml-6 -mr-[224px]",
          "relative z-10",
          "font-sans text-sm text-muted-foreground leading-snug"
        )}
      >
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-electric/70">
          {label}
        </p>
        {children}
      </aside>

      {/* Mobile: inline collapsible */}
      <Collapsible.Root className="lg:hidden my-4">
        <Collapsible.Trigger
          className={cn(
            "flex w-full items-center gap-2 rounded border border-border px-3 py-2",
            "font-mono text-[10px] uppercase tracking-[0.16em] text-electric",
            "transition-colors hover:bg-secondary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-controls={contentId}
        >
          <ChevronDown
            className="h-3 w-3 shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180"
            aria-hidden
          />
          <span>{label}</span>
        </Collapsible.Trigger>
        <Collapsible.Content
          id={contentId}
          aria-live="polite"
          className={cn(
            "overflow-hidden text-sm text-muted-foreground",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out"
          )}
        >
          <div className="border-l-2 border-electric/30 pl-3 pt-2 pb-1">{children}</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}
