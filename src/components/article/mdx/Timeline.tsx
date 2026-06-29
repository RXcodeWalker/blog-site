import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionSafe, useInView } from "./animations";

interface TimelineProps {
  children: ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <ol className="my-10 border-l-2 border-border pl-6 space-y-0">
      {children}
    </ol>
  );
}

interface TimelineItemProps {
  date: string;
  title: string;
  accent?: boolean;
  children?: ReactNode;
  id?: string;
  index?: number;
}

export function TimelineItem({
  date,
  title,
  accent = false,
  children,
  id,
  index = 0,
}: TimelineItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref);
  const motionSafe = useMotionSafe();

  return (
    <li
      ref={ref}
      id={id}
      className={cn(
        "relative pb-8 last:pb-0",
        motionSafe && "transition-all duration-500",
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
      style={
        motionSafe ? { transitionDelay: `${index * 100}ms` } : undefined
      }
    >
      {/* Dot */}
      <span
        className={cn(
          "absolute -left-[1.875rem] top-1 h-3.5 w-3.5 rounded-full border-2",
          accent
            ? "border-gold bg-gold/20"
            : "border-border bg-background"
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em]",
            accent ? "text-gold" : "text-muted-foreground"
          )}
        >
          {date}
        </p>
        <h3 className="mt-0.5 font-serif text-lg font-light leading-snug text-foreground">
          {title}
        </h3>
        {children && (
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}
