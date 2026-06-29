// DOCS-ONLY: imported only by /authoring page. Never import React components here.
// When a component's props change, update this file in the same PR.

export interface PropDef {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ExampleDef {
  label: string;
  code: string;
}

export interface ComponentMeta {
  name: string;
  mdxTags: string[];
  category: "editorial" | "layout" | "interactive" | "media" | "code";
  description: string;
  versionIntroduced: string;
  deprecated: boolean;
  deprecationMessage?: string;
  props: PropDef[];
  examples: ExampleDef[];
  accessibilityNotes: string;
}

export const COMPONENT_REGISTRY: ComponentMeta[] = [
  {
    name: "PullQuote",
    mdxTags: ["PullQuote"],
    category: "editorial",
    description:
      "Large editorial quote that breaks the prose column. Use for memorable statements that deserve visual emphasis.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "The quote content. May include inline formatting.",
      },
      {
        name: "attribution",
        type: "string",
        required: false,
        description: "Rendered below the quote — e.g. '— Author Name, Source'.",
      },
      {
        name: "accent",
        type: '"gold" | "electric"',
        required: false,
        default: '"gold"',
        description: "Left border color token.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID for deep-linking.",
      },
    ],
    examples: [
      {
        label: "Basic",
        code: `<PullQuote attribution="— Author Name">\n  Your memorable quote here.\n</PullQuote>`,
      },
      {
        label: "Electric accent",
        code: `<PullQuote accent="electric">\n  A technically precise statement.\n</PullQuote>`,
      },
    ],
    accessibilityNotes:
      "Rendered as <blockquote>. Attribution is a <footer> inside the blockquote. No extra ARIA needed — semantic HTML is sufficient.",
  },
  {
    name: "Sidenote",
    mdxTags: ["Sidenote"],
    category: "editorial",
    description:
      "Marginal annotation that floats into the right gutter on desktop and collapses inline on mobile.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Annotation content.",
      },
      {
        name: "label",
        type: "string",
        required: false,
        default: '"Note"',
        description:
          "Heading label for the mobile toggle button and the aside aria-label.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID for deep-linking.",
      },
    ],
    examples: [
      {
        label: "Inline usage",
        code: `The engine was redesigned<Sidenote>Uses the Maglev compiler tier.</Sidenote> entirely.`,
      },
    ],
    accessibilityNotes:
      "Rendered as <aside aria-label={label}>. Mobile toggle button has aria-expanded and aria-controls. Radix Collapsible manages focus and ARIA state.",
  },
  {
    name: "Callout",
    mdxTags: ["Callout"],
    category: "editorial",
    description:
      "Colored information box for tips, warnings, and editorial insights. Five semantic types with distinct icons.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "type",
        type: '"info" | "tip" | "warning" | "danger" | "insight"',
        required: false,
        default: '"info"',
        description: "Determines color, icon, and ARIA role.",
      },
      {
        name: "title",
        type: "string",
        required: false,
        description: "Optional bold heading inside the box.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Box content.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID for deep-linking.",
      },
    ],
    examples: [
      {
        label: "Tip",
        code: `<Callout type="tip" title="Before you continue">\n  Requires Node 20+.\n</Callout>`,
      },
      {
        label: "Danger",
        code: `<Callout type="danger">\n  Running this drops all cached data.\n</Callout>`,
      },
    ],
    accessibilityNotes:
      "info/tip/insight use role='note'. warning/danger use role='alert' so screen readers announce them immediately on page load.",
  },
  {
    name: "Timeline",
    mdxTags: ["Timeline", "TimelineItem"],
    category: "layout",
    description:
      "Vertical chronological sequence. Use Timeline as the parent and TimelineItem for each event.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "TimelineItem children only.",
      },
    ],
    examples: [
      {
        label: "Basic",
        code: `<Timeline>\n  <TimelineItem date="2020" title="Start" accent>First prototypes.</TimelineItem>\n  <TimelineItem date="2024" title="Launch">Shipped to 500 users.</TimelineItem>\n</Timeline>`,
      },
    ],
    accessibilityNotes:
      "Rendered as <ol> (ordered list — chronological sequence). Each TimelineItem is an <li>. Staggered entry animations are aria-hidden; no live region needed.",
  },
  {
    name: "ComparisonBlock",
    mdxTags: ["ComparisonBlock", "ComparisonColumn"],
    category: "layout",
    description:
      "Side-by-side column comparison. Supports 2 or more columns. Use ComparisonColumn for each column.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "labels",
        type: "string[]",
        required: false,
        default: '["Before", "After"]',
        description:
          "One label per column. Length determines column count.",
      },
      {
        name: "accent",
        type: '"gold" | "electric" | "none"',
        required: false,
        default: '"none"',
        description: "Column header accent color.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "ComparisonColumn children.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID.",
      },
    ],
    examples: [
      {
        label: "Two columns",
        code: `<ComparisonBlock labels={["Before", "After"]}>\n  <ComparisonColumn>Simple but fragile</ComparisonColumn>\n  <ComparisonColumn>Complex but scalable</ComparisonColumn>\n</ComparisonBlock>`,
      },
      {
        label: "Three columns",
        code: `<ComparisonBlock labels={["Option A", "Option B", "Option C"]}>\n  <ComparisonColumn>...</ComparisonColumn>\n  <ComparisonColumn>...</ComparisonColumn>\n  <ComparisonColumn>...</ComparisonColumn>\n</ComparisonBlock>`,
      },
    ],
    accessibilityNotes:
      "Column container uses role='list', each ComparisonColumn uses role='listitem' with aria-label from the corresponding label. Columns stack on mobile.",
  },
  {
    name: "Statistic",
    mdxTags: ["Statistic"],
    category: "editorial",
    description:
      "Large typographic statistic with label and optional context line. Counts up when entering the viewport.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "value",
        type: "string",
        required: true,
        description: "The statistic value. e.g. '47%' or '2.4M'.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Short descriptor below the number.",
      },
      {
        name: "context",
        type: "string",
        required: false,
        description: "Optional smaller footnote line.",
      },
      {
        name: "accent",
        type: '"gold" | "electric"',
        required: false,
        default: '"gold"',
        description: "Value color token.",
      },
      {
        name: "animateCount",
        type: "boolean",
        required: false,
        default: "true",
        description:
          "Counts up on viewport entry. Disabled when prefers-reduced-motion is set.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID.",
      },
    ],
    examples: [
      {
        label: "Basic",
        code: `<Statistic value="47%" label="Load time reduction" context="30-day rolling average" />`,
      },
      {
        label: "Grid of stats",
        code: `<div className="flex gap-8 flex-wrap my-10">\n  <Statistic value="2.4M" label="Monthly active users" accent="electric" />\n  <Statistic value="99.97%" label="Uptime SLA" />\n  <Statistic value="14ms" label="P99 latency" />\n</div>`,
      },
    ],
    accessibilityNotes:
      "Count-up animation numbers are aria-hidden. An aria-live='polite' span announces the final value once the animation completes. Non-numeric values fall back to fade-in only.",
  },
  {
    name: "CodePlayground",
    mdxTags: ["CodePlayground"],
    category: "code",
    description:
      "Live-editable code sandbox powered by Sandpack. Supports React, TypeScript, and multi-file projects. Lazy-loaded — zero cost for posts that don't use it.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "template",
        type: '"react" | "react-ts" | "vanilla" | "vanilla-ts"',
        required: false,
        default: '"react-ts"',
        description: "Sandpack project template.",
      },
      {
        name: "files",
        type: "Record<string, string>",
        required: false,
        description:
          "Multi-file map. If omitted, children is used as the single entry file.",
      },
      {
        name: "entry",
        type: "string",
        required: false,
        default: '"/App.tsx"',
        description: "Entry file key when using the files prop.",
      },
      {
        name: "height",
        type: "number",
        required: false,
        default: "400",
        description: "Editor height in pixels.",
      },
      {
        name: "showConsole",
        type: "boolean",
        required: false,
        default: "false",
        description: "Show the Sandpack console panel.",
      },
      {
        name: "showReset",
        type: "boolean",
        required: false,
        default: "true",
        description: "Show Reset button in toolbar.",
      },
      {
        name: "showCopyAll",
        type: "boolean",
        required: false,
        default: "true",
        description: "Show Copy All Files button in toolbar.",
      },
      {
        name: "children",
        type: "string",
        required: false,
        description:
          "Inline shorthand for a single-file demo. Used when files is not provided.",
      },
    ],
    examples: [
      {
        label: "Single file",
        code: `<CodePlayground template="react-ts">\n{\`import { useState } from 'react';\nexport default function Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n+1)}>Count: {n}</button>;\n}\`}\n</CodePlayground>`,
      },
    ],
    accessibilityNotes:
      "CodeMirror 6 editor is keyboard accessible. The preview iframe is wrapped in role='region' aria-label='Live code preview'. Reset and Copy All are native <button> elements.",
  },
  {
    name: "InteractiveWidget",
    mdxTags: ["InteractiveWidget"],
    category: "interactive",
    description:
      "Embed a named interactive widget by registry lookup. Widgets are lazy-loaded and isolated in an Error Boundary.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "name",
        type: "string",
        required: true,
        description:
          "Registry key from widget-runtime.ts. Must match exactly — validated at build time by the MDX linter.",
      },
    ],
    examples: [
      {
        label: "Counter demo",
        code: `<InteractiveWidget name="CounterDemo" initialCount={5} />`,
      },
    ],
    accessibilityNotes:
      "Widget-specific. The wrapper Error Boundary renders role='alert' on failure. Suspense skeleton is aria-hidden. Each widget is responsible for its own ARIA.",
  },
  {
    name: "Figure",
    mdxTags: ["Figure"],
    category: "media",
    description:
      "Enhanced image with formal caption, attribution, and optional full-bleed layout. For inline images without captions, standard Markdown syntax (![alt](src)) is sufficient.",
    versionIntroduced: "1.0.0",
    deprecated: false,
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        description: "Image URL.",
      },
      {
        name: "alt",
        type: "string",
        required: true,
        description: "Accessibility description. Required — enforced by the MDX linter.",
      },
      {
        name: "caption",
        type: "string",
        required: false,
        description: "Editorial caption shown below the image.",
      },
      {
        name: "attribution",
        type: "string",
        required: false,
        description: "Photo credit line.",
      },
      {
        name: "fullBleed",
        type: "boolean",
        required: false,
        default: "false",
        description:
          "Breaks out of the 680px prose column to full viewport width.",
      },
      {
        name: "lightbox",
        type: "boolean",
        required: false,
        default: "true",
        description: "Opens the image in a dialog on click.",
      },
      {
        name: "srcSet",
        type: "string",
        required: false,
        description:
          "Responsive image source set. e.g. 'img-480.jpg 480w, img-960.jpg 960w'.",
      },
      {
        name: "sizes",
        type: "string",
        required: false,
        description:
          "Media condition for responsive selection. e.g. '(max-width: 680px) 100vw, 680px'.",
      },
      {
        name: "width",
        type: "number",
        required: false,
        description: "Intrinsic image width. Prevents layout shift.",
      },
      {
        name: "height",
        type: "number",
        required: false,
        description: "Intrinsic image height. Prevents layout shift.",
      },
      {
        name: "id",
        type: "string",
        required: false,
        description: "Anchor ID.",
      },
    ],
    examples: [
      {
        label: "With caption",
        code: `<Figure\n  src="/images/tactics.jpg"\n  alt="Tactical formation diagram"\n  caption="Arsenal's high press dismantled City's build-up."\n  attribution="Photo: Getty Images"\n/>`,
      },
      {
        label: "Full bleed with srcSet",
        code: `<Figure\n  src="/images/hero.jpg"\n  alt="Hero image"\n  srcSet="/images/hero-480.jpg 480w, /images/hero.jpg 1440w"\n  sizes="(max-width: 680px) 100vw, 680px"\n  width={1440}\n  height={810}\n  fullBleed\n/>`,
      },
    ],
    accessibilityNotes:
      "Rendered as <figure> + <figcaption>. alt is required. Attribution is a <small> element inside <figure>. Lightbox dialog uses existing ImageLightbox behavior with focus trap.",
  },
];
