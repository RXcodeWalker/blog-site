import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionSafe, useInView } from "./animations";

interface PullQuoteProps {
  children: ReactNode;
  attribution?: string;
  accent?: "gold" | "electric";
  id?: string;
}

export function PullQuote({ children, attribution, accent = "gold", id }: PullQuoteProps) {
  const ref = useRef<HTMLQuoteElement>(null);
  const inView = useInView(ref);
  const motionSafe = useMotionSafe();

  return (
    <blockquote
      ref={ref}
      id={id}
      className={cn(
        "my-12 border-l-4 px-8 py-2 font-serif text-2xl italic leading-snug tracking-tight md:text-3xl",
        "-mx-4 md:-mx-12",
        accent === "electric" ? "border-electric" : "border-gold",
        motionSafe && "transition-all duration-700",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <p className="text-foreground">{children}</p>
      {attribution && (
        <footer className="mt-4 font-mono text-[11px] not-italic uppercase tracking-[0.18em] text-muted-foreground">
          {attribution}
        </footer>
      )}
    </blockquote>
  );
}
