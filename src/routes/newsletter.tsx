import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { getNewsletterArchive, type ArchiveIssue } from "@/lib/newsletter";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

export const Route = createFileRoute("/newsletter")({
  loader: async () => {
    const issues = await getNewsletterArchive();
    return { issues };
  },
  head: () => ({
    meta: [
      { title: "Newsletter — Beyond the Basics" },
      { name: "description", content: "Occasional, considered writing. No noise." },
      { property: "og:title", content: "Newsletter — Beyond the Basics" },
      { property: "og:description", content: "Occasional, considered writing. No noise." },
    ],
  }),
  component: NewsletterPage,
});

function SubscribeForm() {
  const { email, setEmail, status, handleSubmit } = useNewsletterSubscription("newsletter_page");

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
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
  );
}

function IssueCard({ issue }: { issue: ArchiveIssue }) {
  const date = new Date(issue.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <a
      href={issue.buttondownArchiveUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-2 border-b border-border py-8 transition-opacity hover:opacity-70"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-serif text-xl font-light leading-snug tracking-tight">
          {issue.subject}
        </h2>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      {issue.description && (
        <p className="text-sm text-muted-foreground">{issue.description}</p>
      )}
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
        {date}
      </div>
    </a>
  );
}

function NewsletterPage() {
  const { issues } = Route.useLoaderData();

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-24 lg:px-12 lg:pt-36">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — The Newsletter
        </div>
        <h1 className="mt-8 max-w-3xl font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.95] tracking-[-0.03em]">
          Occasional, considered writing.
        </h1>
        <p className="mt-6 max-w-md text-sm text-muted-foreground">
          No noise. No hype. Just the things I can't stop thinking about — football, code, and
          what it means to keep getting better.
        </p>

        <SubscribeForm />

        <div className="mt-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            — Archive
          </div>

          {issues.length === 0 ? (
            <div className="mt-8 text-sm text-muted-foreground">
              No issues sent yet. Subscribe above to be the first to know when the first one drops.
            </div>
          ) : (
            <div className="mt-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
