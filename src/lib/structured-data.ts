import {
  AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/content/feeds/constants";
import type { PostMeta, CategoryMeta } from "@/content/types";

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

interface SchemaRef {
  "@id": string;
}

interface SchemaPerson {
  "@context"?: "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  email?: string;
}

interface SchemaOrganization {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: { "@type": "ImageObject"; url: string; width: number; height: number };
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
  "@type": "BlogPosting";
  "@id": string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: SchemaPerson;
  publisher: SchemaRef;
  image: { "@type": "ImageObject"; url: string; width: number; height: number };
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
  author: SchemaRef;
}

interface SchemaWebPage {
  "@context": "https://schema.org";
  "@type": "WebPage" | "CollectionPage" | "ProfilePage";
  "@id": string;
  name: string;
  description: string;
  url: string;
  inLanguage: "en";
  isPartOf: SchemaRef;
  breadcrumb?: SchemaBreadcrumbList;
  mainEntity?: SchemaRef;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildPerson(includeContext = true): SchemaPerson {
  const person: SchemaPerson = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    url: AUTHOR.url,
    email: AUTHOR.email,
  };
  if (includeContext) person["@context"] = "https://schema.org";
  return person;
}

function buildOrganization(): SchemaOrganization {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/og/default.png`, width: 1200, height: 630 },
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
    author: { "@id": PERSON_ID },
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
  type: "WebPage" | "CollectionPage" | "ProfilePage";
  id: string;
  name: string;
  desc: string;
  breadcrumb?: SchemaBreadcrumbList;
  mainEntity?: SchemaRef;
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
  if (opts.mainEntity) page.mainEntity = opts.mainEntity;
  return page;
}

function buildBlogPosting(post: PostMeta): SchemaBlogPosting {
  const articleUrl = `${SITE_URL}/article/${post.slug}`;
  const schema: SchemaBlogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#blogposting`,
    headline: post.title,
    description: post.description,
    url: articleUrl,
    datePublished: `${post.publishedAt.slice(0, 10)}T00:00:00Z`,
    dateModified: `${(post.updatedAt ?? post.publishedAt).slice(0, 10)}T00:00:00Z`,
    author: buildPerson(false),
    publisher: { "@id": ORG_ID },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/${post.slug}.png`,
      width: 1200,
      height: 630,
    },
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTimeMinutes}M`,
    articleSection: capitalise(post.category),
    inLanguage: "en",
    mainEntityOfPage: { "@id": articleUrl },
  };
  if (post.tags.length > 0) schema.keywords = post.tags.join(", ");
  if (post.series !== null)
    schema.isPartOf = { "@type": "CreativeWorkSeries", name: post.series.name };
  return schema;
}

export function getHomeStructuredData(): object[] {
  return [
    buildOrganization(),
    buildPerson(),
    buildWebSite(),
    buildWebPage({
      type: "WebPage",
      id: `${SITE_URL}/`,
      name: SITE_TITLE,
      desc: SITE_DESCRIPTION,
    }),
  ];
}

export function getAboutStructuredData(): object[] {
  const aboutUrl = `${SITE_URL}/about`;
  return [
    buildPerson(),
    buildWebPage({
      type: "ProfilePage",
      id: aboutUrl,
      name: `About ${AUTHOR.name}`,
      desc: "About Om Jhamvar: 10th grade student sharing football analysis, coding projects, and growth notes.",
      mainEntity: { "@id": PERSON_ID },
    }),
  ];
}

export function getArticleStructuredData(post: PostMeta): object[] {
  const articleUrl = `${SITE_URL}/article/${post.slug}`;
  const breadcrumb = buildBreadcrumbList([
    { name: "Home", url: `${SITE_URL}/` },
    { name: capitalise(post.category), url: `${SITE_URL}/category/${post.category}` },
    { name: post.title, url: articleUrl },
  ]);
  const webPage = buildWebPage({
    type: "WebPage",
    id: articleUrl,
    name: post.seoTitle,
    desc: post.description,
    breadcrumb,
  });
  return [buildOrganization(), buildBlogPosting(post), webPage];
}

export function getCategoryStructuredData(category: CategoryMeta): object[] {
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;
  const breadcrumb = buildBreadcrumbList([
    { name: "Home", url: `${SITE_URL}/` },
    { name: category.name, url: categoryUrl },
  ]);
  const collectionPage = buildWebPage({
    type: "CollectionPage",
    id: categoryUrl,
    name: category.name,
    desc: category.desc,
    breadcrumb,
  });
  return [collectionPage];
}
