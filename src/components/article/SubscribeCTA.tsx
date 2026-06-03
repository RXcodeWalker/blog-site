import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Inline newsletter call-to-action shown after the article body.
 * No backend yet — submitting confirms locally so it's drop-in to wire to a provider later.
 */
export function SubscribeCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks — you're on the list.");
    setEmail("");
  };

  return (
    <section className="mx-auto mt-24 max-w-2xl px-6">
      <div className="grain rounded-lg border border-border bg-secondary/30 p-8 text-center sm:p-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-electric">
          The newsletter
        </div>
        <h3 className="mt-3 font-serif text-3xl font-light leading-tight tracking-tight">
          Get the next essay in your inbox
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Occasional, considered writing on the things I can't stop thinking about. No noise.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="flex-1 rounded border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Subscribe <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
