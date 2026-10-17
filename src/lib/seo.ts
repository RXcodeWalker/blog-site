import { AUTHOR, DEFAULT_OG_IMAGE, LOCALE, SITE_NAME, SITE_URL } from "@/content/feeds/constants";

export function absoluteUrl(path: string): string {
  const cleaned = path.startsWith("/") ? path : `/${path}`;
  const withoutQuery = cleaned.split("?")[0] ?? cleaned;
  if (withoutQuery === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${withoutQuery.replace(/\/$/, "")}`;
}

export function withSiteTitle(title: string): string {
  if (title === SITE_NAME || title.includes(SITE_NAME)) return title;
  const suffixed = `${title} | ${SITE_NAME}`;
  return suffixed.length <= 60 ? suffixed : title;
}

interface ArticleMeta {
  publishedAt: string;
  updatedAt?: string | null;
  section?: string;
  author?: string;
}

export interface BuildHeadOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  article?: ArticleMeta;
}

type HeadTag = Record<string, string>;

export function buildHead(opts: BuildHeadOptions) {
  const title = withSiteTitle(opts.title);
  const url = absoluteUrl(opts.path);
  const image = opts.image ?? DEFAULT_OG_IMAGE;
  const imageAbs = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const type = opts.type ?? "website";
  const imageAlt = opts.imageAlt ?? `${title} — ${AUTHOR.name}`;

  const meta: HeadTag[] = [
    { title },
    { name: "description", content: opts.description },
    { name: "author", content: opts.article?.author ?? AUTHOR.name },
    { property: "og:title", content: title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: LOCALE },
    { property: "og:image", content: imageAbs },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: imageAbs },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (opts.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  if (opts.article) {
    meta.push({
      property: "article:published_time",
      content: `${opts.article.publishedAt.slice(0, 10)}T00:00:00Z`,
    });
    meta.push({
      property: "article:modified_time",
      content: `${(opts.article.updatedAt ?? opts.article.publishedAt).slice(0, 10)}T00:00:00Z`,
    });
    if (opts.article.section) {
      meta.push({ property: "article:section", content: opts.article.section });
    }
    if (opts.article.author) {
      meta.push({ property: "article:author", content: opts.article.author });
    }
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function jsonLd(schemas: object[]) {
  return schemas.map((schema) => ({
    type: "application/ld+json",
    children: JSON.stringify(schema),
  }));
}
