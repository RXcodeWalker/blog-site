import { ArrowRight, Loader2 } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

export function SubscribeCTA() {
  const { email, setEmail, status, handleSubmit } = useNewsletterSubscription("article");

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
          {/* honeypot — bots fill this, humans don't */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            aria-hidden="true"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            disabled={status === "loading" || status === "success"}
            className="flex-1 rounded border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex items-center justify-center gap-2 rounded bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subscribing
              </>
            ) : status === "success" ? (
              "Check inbox"
            ) : (
              <>
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
