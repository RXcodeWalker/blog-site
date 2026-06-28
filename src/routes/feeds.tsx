import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { CATEGORY_SLUGS, CATEGORIES } from "@/content/taxonomy/categories";
import { SITE_URL } from "@/content/feeds/constants";

export const Route = createFileRoute("/feeds")({
  head: () => ({
    meta: [
      { title: "Subscribe — Beyond the Basics" },
      {
        name: "description",
        content: "RSS and JSON feeds for every section of Beyond the Basics.",
      },
    ],
  }),
  component: FeedsPage,
});

interface FeedCardProps {
  label: string;
  description: string;
  url: string;
  type: "rss" | "json";
}

function FeedCard({ label, description, url, type }: FeedCardProps) {
  const [copied, setCopied] = useState(false);
  const absoluteUrl = `${SITE_URL}${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-3 border border-border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-electric">
            {type === "rss" ? "RSS 2.0" : "JSON Feed 1.1"}
          </div>
          <h3 className="mt-1 font-serif text-xl">{label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-secondary px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
          {absoluteUrl}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={url}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-gold transition-opacity hover:opacity-70"
        >
          Open ↗
        </a>
      </div>
    </div>
  );
}

function FeedsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric">
            — Subscribe
          </div>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6rem)] font-light leading-[0.95] tracking-[-0.03em]">
            Feeds
          </h1>
          <p className="mt-8 font-serif text-xl italic leading-relaxed text-muted-foreground text-pretty">
            Subscribe to Beyond the Basics in any feed reader. RSS and JSON
            feeds are available for the full site, each section, and each
            content type.
          </p>
        </div>

        <div className="mt-20 space-y-16">
          {/* Global feeds */}
          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Global Feeds
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FeedCard
                label="Everything"
                description="All posts from Beyond the Basics, newest first."
                url="/rss.xml"
                type="rss"
              />
              <FeedCard
                label="Everything"
                description="All posts in JSON Feed format for modern readers."
                url="/feed.json"
                type="json"
              />
            </div>
          </section>

          {/* Category feeds */}
          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Section Feeds
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_SLUGS.map((slug) => {
                const cat = CATEGORIES[slug];
                return (
                  <FeedCard
                    key={slug}
                    label={cat.name}
                    description={cat.desc}
                    url={`/category/${slug}/rss.xml`}
                    type="rss"
                  />
                );
              })}
            </div>
          </section>

          {/* Tag feeds */}
          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Tag Feeds
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <FeedCard
                label="Articles"
                description="Long-form articles from Beyond the Basics."
                url="/tag/Articles/rss.xml"
                type="rss"
              />
              <FeedCard
                label="Notes"
                description="Short notes and quick takes from Om Jhamvar."
                url="/tag/Notes/rss.xml"
                type="rss"
              />
              <FeedCard
                label="Series"
                description="Multi-part series from Beyond the Basics."
                url="/tag/Series/rss.xml"
                type="rss"
              />
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
