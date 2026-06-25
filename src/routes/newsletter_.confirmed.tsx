import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/newsletter_/confirmed")({
  head: () => ({
    meta: [
      { title: "You're subscribed — Beyond the Basics" },
      { name: "description", content: "Thanks for confirming. You're on the list." },
    ],
  }),
  component: NewsletterConfirmed,
});

function NewsletterConfirmed() {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-electric">
          — Confirmed
        </div>
        <h1 className="mt-6 max-w-xl font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[1] tracking-[-0.03em]">
          You're on the list.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Thanks for confirming. You'll hear from me when the next essay drops — no noise, just
          the good stuff.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/newsletter"
            className="rounded bg-primary px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse the archive
          </Link>
          <Link
            to="/"
            className="rounded border border-border px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary/40"
          >
            Read the blog
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
