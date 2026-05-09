import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Theory — Beyond the Basics" },
      { name: "description", content: "The editorial principles behind Beyond the Basics. Why we write what we write." },
      { property: "og:title", content: "Theory — Beyond the Basics" },
      { property: "og:description", content: "The editorial principles behind Beyond the Basics." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-24 lg:px-12 lg:pt-36">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">— The Theory</div>
        <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-balance">
          We write for the <em className="italic text-gold">curious obsessive.</em>
        </h1>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-2xl leading-snug text-muted-foreground italic text-pretty">
              The internet is full of people writing about everything. Beyond the Basics is for people writing about the few things they cannot stop thinking about.
            </p>
            <Link to="/" className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.22em] underline-grow">
              ← Back to the index
            </Link>
          </div>
          <div className="md:col-span-6 md:col-start-7 reading-prose !text-base">
            <p>
              This is a publication built around a single conviction: the things worth writing about are the things you have spent at least a thousand hours obsessing over. Everything else is noise.
            </p>
            <p>
              We cover four territories: <strong>football tactics</strong>, where geometry is destiny; <strong>technology</strong>, where the substrate determines the surface; <strong>systems thinking</strong>, the discipline of seeing whole pictures; and <strong>philosophy</strong>, because the examined life is the only one worth living at speed.
            </p>
            <p>
              We do not publish on a schedule. We publish when there is something to say. Most weeks, that is once. Some weeks, that is nothing. The cost of waiting is the price of signal.
            </p>
          </div>
        </div>
      </section>

      {/* Principles — brutalist */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">— Principles</div>
          <h2 className="mt-4 font-serif text-5xl font-light tracking-tight md:text-6xl">Four rules.</h2>
          <ol className="mt-16 grid gap-px overflow-hidden border border-border md:grid-cols-2">
            {[
              { n: "I", t: "Depth over breadth", d: "If we cannot go further than the surface, we will not go at all. The shallow thought has no place here." },
              { n: "II", t: "Write only what compounds", d: "Essays should still be useful in five years. We avoid the news cycle and the discourse." },
              { n: "III", t: "Form is content", d: "Typography, spacing, and rhythm are not decoration. They are the argument made visible." },
              { n: "IV", t: "Earn every adjective", d: "Strong claims demand strong evidence. We over-prepare and under-promise." },
            ].map((p) => (
              <li key={p.n} className="bg-background p-10 md:p-14">
                <div className="font-serif text-5xl italic text-gold">{p.n}</div>
                <h3 className="mt-6 font-serif text-3xl tracking-tight">{p.t}</h3>
                <p className="mt-3 text-muted-foreground">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Editor */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">— The Editor</div>
            <h2 className="mt-4 font-serif text-5xl font-light leading-tight tracking-tight">K. Mensah</h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Engineer by training. Writer by compulsion. Spends an unreasonable amount of time watching football matches with the sound off.
            </p>
          </div>
          <div className="md:col-span-7">
            <dl className="grid grid-cols-2 gap-x-12 gap-y-8 font-mono text-[11px] uppercase tracking-[0.18em]">
              {[
                ["Based in", "Lisbon"],
                ["Writes since", "2019"],
                ["Reading", "Deutsch · Wilson"],
                ["Watching", "Bayer Leverkusen"],
                ["Building", "Quiet things"],
                ["Inbox", "open · slow"],
              ].map(([k, v]) => (
                <div key={k as string} className="border-b border-border pb-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-2 font-serif text-xl normal-case tracking-normal text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Colophon */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">— Colophon</div>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight">Made with care.</h2>
            </div>
            <div className="reading-prose md:col-span-7 md:col-start-6 !text-base">
              <p>
                Set in <strong>Fraunces</strong>, a contemporary serif drawn from the lineage of Cooper. Body text in <strong>Inter</strong>. Mono in <strong>JetBrains Mono</strong>.
              </p>
              <p>
                Built on TanStack Start with attention to the small frictions: page transitions, type rhythm, the cost of every kilobyte. The cursor moves; the page should respond.
              </p>
              <p>
                If something here was useful — or, better, useless but beautiful — please write back. The inbox is open.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
