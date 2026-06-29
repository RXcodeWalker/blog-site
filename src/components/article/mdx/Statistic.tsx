import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionSafe, useInView, useCountUp } from "./animations";

interface StatisticProps {
  value: string;
  label: string;
  context?: string;
  accent?: "gold" | "electric";
  animateCount?: boolean;
  id?: string;
}

function parseNumeric(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

function AnimatedNumber({
  parsed,
  active,
  motionSafe,
}: {
  parsed: { num: number; prefix: string; suffix: string };
  active: boolean;
  motionSafe: boolean;
}) {
  const animated = motionSafe && active;
  const displayed = useCountUp(Math.round(parsed.num), 1200, animated);
  const finalValue = `${parsed.prefix}${Math.round(parsed.num)}${parsed.suffix}`;
  const displayValue = `${parsed.prefix}${displayed}${parsed.suffix}`;
  return (
    <>
      <span aria-hidden>{displayValue}</span>
      <span className="sr-only" aria-live="polite">
        {active ? finalValue : ""}
      </span>
    </>
  );
}

export function Statistic({
  value,
  label,
  context,
  accent = "gold",
  animateCount = true,
  id,
}: StatisticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const motionSafe = useMotionSafe();
  const parsed = parseNumeric(value);
  const accentClass = accent === "electric" ? "text-electric" : "text-gold";

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        "my-10 inline-block border-t pt-4 transition-opacity duration-700",
        accent === "electric" ? "border-electric/30" : "border-gold/30",
        inView ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "font-serif leading-none tracking-tight",
          accentClass,
          "text-[clamp(3rem,8vw,6rem)]"
        )}
      >
        {parsed && animateCount ? (
          <AnimatedNumber parsed={parsed} active={inView} motionSafe={motionSafe} />
        ) : (
          value
        )}
      </div>
      <p className="mt-2 font-sans text-sm font-medium text-foreground">{label}</p>
      {context && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {context}
        </p>
      )}
    </div>
  );
}
