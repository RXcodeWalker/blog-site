import { createAPIFileRoute } from "@tanstack/react-start/api";
import { generateJsonFeed } from "../content/feeds/json";

export const APIRoute = createAPIFileRoute("/feed.json")({
  GET: () =>
    new Response(generateJsonFeed(), {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }),
});
