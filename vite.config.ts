// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

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

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkExportRaw],
        rehypePlugins: [rehypeSlug],
      }),
    ],
  },
});
