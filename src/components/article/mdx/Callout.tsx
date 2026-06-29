import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, AlertOctagon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning" | "danger" | "insight";

const CONFIG: Record<
  CalloutType,
  { icon: React.ElementType; border: string; bg: string; iconColor: string; role: string }
> = {
  info: {
    icon: Info,
    border: "border-electric/40",
    bg: "bg-electric/5",
    iconColor: "text-electric",
    role: "note",
  },
  tip: {
    icon: Lightbulb,
    border: "border-gold/40",
    bg: "bg-gold/5",
    iconColor: "text-gold",
    role: "note",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/5",
    iconColor: "text-yellow-400",
    role: "alert",
  },
  danger: {
    icon: AlertOctagon,
    border: "border-destructive/40",
    bg: "bg-destructive/5",
    iconColor: "text-destructive",
    role: "alert",
  },
  insight: {
    icon: Sparkles,
    border: "border-gold/40",
    bg: "bg-gold/5",
    iconColor: "text-gold",
    role: "note",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  id?: string;
}

export function Callout({ type = "info", title, children, id }: CalloutProps) {
  const { icon: Icon, border, bg, iconColor, role } = CONFIG[type];
  return (
    <div
      id={id}
      role={role}
      className={cn(
        "my-6 flex gap-4 rounded-r border-l-4 px-5 py-4",
        border,
        bg
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} aria-hidden />
      <div className="min-w-0 flex-1 text-[0.95rem] leading-relaxed">
        {title && (
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
            {title}
          </p>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
