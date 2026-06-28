import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/content/feeds/constants";
import type { PostMeta, CategoryMeta } from "@/content/types";

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

interface SchemaRef { "@id": string }

interface SchemaPerson {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  email?: string;
}

interface SchemaOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: { "@type": "ImageObject"; url: string };
}

interface SchemaListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaListItem[];
}

interface SchemaBlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting" | "Article";
  "@id": string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: SchemaRef;
  publisher: SchemaRef;
  image: { "@type": "ImageObject"; url: string };
  wordCount: number;
  timeRequired: string;
  articleSection: string;
  inLanguage: "en";
  mainEntityOfPage: SchemaRef;
  keywords?: string;
  isPartOf?: { "@type": "CreativeWorkSeries"; name: string };
}

interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  description: string;
  inLanguage: "en";
  publisher: SchemaRef;
  potentialAction: {
    "@type": "SearchAction";
    target: { "@type": "EntryPoint"; urlTemplate: string };
    "query-input": "required name=search_term_string";
  };
}

interface SchemaWebPage {
  "@context": "https://schema.org";
  "@type": "WebPage" | "CollectionPage";
  "@id": string;
  name: string;
  description: string;
  url: string;
  inLanguage: "en";
  isPartOf: SchemaRef;
  breadcrumb?: SchemaBreadcrumbList;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildPerson(): SchemaPerson {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Om Jhamvar",
    url: SITE_URL,
    email: "jhamvar@gmail.com",
  };
}

function buildOrganization(): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Beyond the Basics",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/og/default.png` },
  };
}

function buildWebSite(): SchemaWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

function buildBreadcrumbList(items: Array<{ name: string; url: string }>): SchemaBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildWebPage(opts: {
  type: "WebPage" | "CollectionPage";
  id: string;
  name: string;
  desc: string;
  breadcrumb?: SchemaBreadcrumbList;
}): SchemaWebPage {
  const page: SchemaWebPage = {
    "@context": "https://schema.org",
    "@type": opts.type,
    "@id": opts.id,
    name: opts.name,
    description: opts.desc,
    url: opts.id,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
  };
  if (opts.breadcrumb) page.breadcrumb = opts.breadcrumb;
  return page;
}

function buildBlogPosting(post: PostMeta): SchemaBlogPosting {
  const articleUrl = `${SITE_URL}/article/${post.slug}`;
  const schema: SchemaBlogPosting = {
    "@context": "https://schema.org",
    "@type": post.tags.includes("Articles") ? "Article" : "BlogPosting",
    "@id": `${articleUrl}#blogposting`,
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    datePublished: `${post.publishedAt}T00:00:00Z`,
    dateModified: `${post.updatedAt ?? post.publishedAt}T00:00:00Z`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    image: { "@type": "ImageObject", url: `${SITE_URL}/og/${post.slug}.png` },
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTimeMinutes}M`,
    articleSection: capitalise(post.category),
    inLanguage: "en",
    mainEntityOfPage: { "@id": articleUrl },
  };
  if (post.tags.length > 0) schema.keywords = post.tags.join(", ");
  if (post.series !== null) schema.isPartOf = { "@type": "CreativeWorkSeries", name: post.series.name };
  return schema;
}

export function getSiteStructuredData(): object[] {
  const homeWebPage = buildWebPage({
    type: "WebPage",
    id: `${SITE_URL}/`,
    name: SITE_TITLE,
    desc: SITE_DESCRIPTION,
  });
  return [buildOrganization(), buildPerson(), buildWebSite(), homeWebPage];
}

export function getArticleStructuredData(post: PostMeta): object[] {
  const articleUrl = `${SITE_URL}/article/${post.slug}`;
  const breadcrumb = buildBreadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: capitalise(post.category), url: `${SITE_URL}/category/${post.category}` },
    { name: post.title, url: articleUrl },
  ]);
  const webPage = buildWebPage({
    type: "WebPage",
    id: articleUrl,
    name: post.title,
    desc: post.excerpt,
    breadcrumb,
  });
  return [buildBlogPosting(post), webPage, breadcrumb];
}

export function getCategoryStructuredData(category: CategoryMeta): object[] {
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;
  const breadcrumb = buildBreadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: categoryUrl },
  ]);
  const collectionPage = buildWebPage({
    type: "CollectionPage",
    id: categoryUrl,
    name: category.name,
    desc: category.desc,
    breadcrumb,
  });
  return [collectionPage, breadcrumb];
}
