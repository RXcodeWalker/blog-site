import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Beyond the Basics" },
      {
        name: "description",
        content:
          "About Om Jhamvar: 10th grade student sharing football analysis, coding projects, and growth notes.",
      },
      { property: "og:title", content: "About — Beyond the Basics" },
      {
        property: "og:description",
        content: "Get to know Om Jhamvar and the story behind Beyond the Basics.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-24 lg:px-12 lg:pt-36">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          — The Story
        </div>
        <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-balance">
          About <em className="italic text-gold">Me.</em>
        </h1>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-2xl leading-snug text-muted-foreground italic text-pretty">
              Hey! I'm Om Jhamvar, a 10th grade student from India who is obsessed with football,
              coding, and continuous learning.
            </p>
            <Link
              to="/"
              className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.22em] underline-grow"
            >
              ← Back to the index
            </Link>
          </div>
          <div className="md:col-span-6 md:col-start-7 reading-prose !text-base">
            <p>
              Welcome to my corner of the internet where I share my thoughts, projects, and journey.
              This blog is where I document everything I learn, analyze, and build in public.
            </p>
            <p>
              As a proud Arsenal supporter, I spend a lot of time analyzing matches, discussing
              tactics, and following the transfer market. Football helps me understand strategy,
              teamwork, and resilience.
            </p>
            <p>
              On the tech side, I'm diving deep into web development and software engineering. I
              love building things that solve real problems and crafting user experiences that feel
              magical.
            </p>
          </div>
        </div>
      </section>

      {/* What Drives Me */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            — What Drives Me
          </div>
          <h2 className="mt-4 font-serif text-5xl font-light tracking-tight md:text-6xl">
            Four pillars.
          </h2>
          <ol className="mt-16 grid gap-px overflow-hidden border border-border md:grid-cols-2">
            {[
              {
                n: "I",
                t: "Football",
                d: "Die-hard Arsenal fan. I analyze tactics, follow transfers, and write about the beautiful game.",
              },
              {
                n: "II",
                t: "Coding",
                d: "Passionate about web development, software engineering, and learning new technologies.",
              },
              {
                n: "III",
                t: "Guitar",
                d: "LCM Grade 8 with High Distinction. Currently working towards my Diploma in music.",
              },
              {
                n: "IV",
                t: "Growth",
                d: "Committed to continuous learning and personal development across everything I do.",
              },
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
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              — Quick Facts
            </div>
            <h2 className="mt-4 font-serif text-5xl font-light leading-tight tracking-tight">
              Om Jhamvar
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Student builder, Arsenal fan, and curious creator sharing honest progress over
              polished perfection.
            </p>
          </div>
          <div className="md:col-span-7">
            <dl className="grid grid-cols-2 gap-x-12 gap-y-8 font-mono text-[11px] uppercase tracking-[0.18em]">
              {[
                ["Grade", "10th Grade Student"],
                ["Club", "Arsenal FC"],
                ["Based in", "India"],
                ["Focus", "Learning and building daily"],
                ["Goals", "Build things that matter"],
                ["Inbox", "Always open"],
              ].map(([k, v]) => (
                <div key={k as string} className="border-b border-border pb-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-2 font-serif text-xl normal-case tracking-normal text-foreground">
                    {v}
                  </dd>
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
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                — Let's Connect
              </div>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight">
                Let's talk football or build something cool.
              </h2>
            </div>
            <div className="reading-prose md:col-span-7 md:col-start-6 !text-base">
              <p>
                Whether you want to debate Arsenal's best XI, collaborate on a project, or just say
                hi, I'd love to hear from you.
              </p>
              <p>
                Beyond the Basics is my place to think out loud, document what I'm learning, and
                connect with people who care about craft.
              </p>
              <p>
                If something here resonated with you, reach out and let's build in public together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
