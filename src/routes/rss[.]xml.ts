import { createFileRoute } from "@tanstack/react-router";
import { generateRssFeed } from "../content/feeds/rss";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(generateRssFeed(), {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        }),
    },
  },
});
