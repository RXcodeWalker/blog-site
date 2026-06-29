// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { ogImagesPlugin } from "./vite-plugin-og-images";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkMdxLint } from "./src/components/article/mdx/mdx-lint";

// Remark plugin: embed the MDX body text (frontmatter stripped) as a named export so
// postManifest.ts can calculate reading time without relying on `?raw` imports.
// `?raw` glob imports are intercepted by @mdx-js/rollup in the Cloudflare server build —
// they return a compiled React component instead of a string, crashing extractBody().
function remarkExportRaw() {
  return function (tree: any, file: any) {
    const src = String(file.value);
    const body = src.replace(/^---[\s\S]*?---\n?/, "").trim();
    tree.children.push({
      type: "mdxjsEsm",
      value: `export const rawBody = ${JSON.stringify(body)}`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              exportKind: "value",
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "rawBody" },
                    init: { type: "Literal", value: body },
                  },
                ],
              },
              specifiers: [],
              source: null,
            },
          ],
        },
      },
    });
  };
}

// Rehype plugin: collect h2/h3 headings (with the ids rehype-slug already assigned) and embed
// them as a JSON string export `headingsJson`, so the table of contents can be built at build
// time without re-parsing markdown at runtime. MUST run after rehypeSlug so ids exist.
function rehypeCollectHeadings() {
  const textOf = (node: any): string => {
    if (node.type === "text") return node.value;
    if (Array.isArray(node.children)) return node.children.map(textOf).join("");
    return "";
  };
  const walk = (node: any, out: any[]) => {
    if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
      const id = node.properties?.id;
      if (id)
        out.push({ depth: node.tagName === "h2" ? 2 : 3, id: String(id), text: textOf(node) });
    }
    if (Array.isArray(node.children)) for (const child of node.children) walk(child, out);
  };
  return function (tree: any) {
    const headings: { depth: number; id: string; text: string }[] = [];
    walk(tree, headings);
    const json = JSON.stringify(headings);
    tree.children.push({
      type: "mdxjsEsm",
      value: `export const headingsJson = ${JSON.stringify(json)}`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              exportKind: "value",
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "headingsJson" },
                    init: { type: "Literal", value: json },
                  },
                ],
              },
              specifiers: [],
              source: null,
            },
          ],
        },
      },
    });
  };
}

// Build-time syntax highlighting via Shiki. Dual themes emit `--shiki-light`/`--shiki-dark` CSS
// variables on each token so the rendered code follows the app's .light/.dark theme (see styles.css).
const rehypePrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkExportRaw, remarkMdxLint],
        rehypePlugins: [
          rehypeSlug,
          rehypeCollectHeadings,
          [rehypePrettyCode, rehypePrettyCodeOptions],
        ],
      }),
      ogImagesPlugin(),
    ],
  },
});
