import { createAPIFileRoute } from "@tanstack/react-start/api";
import { generateSitemap } from "../content/feeds/sitemap";

export const APIRoute = createAPIFileRoute("/sitemap.xml")({
  GET: () =>
    new Response(generateSitemap(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }),
});
