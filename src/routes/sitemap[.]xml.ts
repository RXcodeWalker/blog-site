import { createFileRoute } from "@tanstack/react-router";
import { generateSitemap } from "../content/feeds/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(generateSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        }),
    },
  },
});
