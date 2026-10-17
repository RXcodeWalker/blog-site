import { createFileRoute } from "@tanstack/react-router";
import { generateJsonFeed } from "../content/feeds/json";

export const Route = createFileRoute("/feed.json")({
  server: {
    handlers: {
      GET: () =>
        new Response(generateJsonFeed(), {
          headers: {
            "Content-Type": "application/feed+json; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        }),
    },
  },
});
