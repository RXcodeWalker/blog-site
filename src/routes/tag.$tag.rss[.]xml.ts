import { createAPIFileRoute } from "@tanstack/react-start/api";
import { generateRssFeed } from "../content/feeds/rss";
import { getPostsByTag } from "../content/api";
import { SITE_URL } from "../content/feeds/constants";

const VALID_TAGS = ["Articles", "Notes", "Series"] as const;
const TAG_DESCRIPTIONS: Record<string, string> = {
  Articles: "Long-form articles from Beyond the Basics.",
  Notes: "Short notes and quick takes from Om Jhamvar.",
  Series: "Multi-part series from Beyond the Basics.",
};

export const APIRoute = createAPIFileRoute("/tag/$tag/rss.xml")({
  GET: ({ params }) => {
    const normalized = VALID_TAGS.find(
      (t) => t.toLowerCase() === params.tag.toLowerCase(),
    );
    if (!normalized) return new Response("Not found", { status: 404 });
    return new Response(
      generateRssFeed({
        title: `${normalized} — Beyond the Basics`,
        description: TAG_DESCRIPTIONS[normalized],
        posts: getPostsByTag(normalized),
        selfUrl: `${SITE_URL}/tag/${normalized}/rss.xml`,
      }),
      {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  },
});
