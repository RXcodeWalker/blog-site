import { createAPIFileRoute } from "@tanstack/react-start/api";
import { generateRssFeed } from "../content/feeds/rss";

export const APIRoute = createAPIFileRoute("/rss.xml")({
  GET: () =>
    new Response(generateRssFeed(), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }),
});
