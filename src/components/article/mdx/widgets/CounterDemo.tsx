import { useState } from "react";

interface CounterDemoProps {
  initialCount?: number;
}

export default function CounterDemo({ initialCount = 0 }: CounterDemoProps) {
  const [count, setCount] = useState(initialCount);
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="font-mono text-5xl font-light tabular-nums text-gold">{count}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCount((n) => n - 1)}
          className="rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-gold hover:text-gold"
          aria-label="Decrement"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setCount(initialCount)}
          className="rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setCount((n) => n + 1)}
          className="rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-electric hover:text-electric"
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
}
