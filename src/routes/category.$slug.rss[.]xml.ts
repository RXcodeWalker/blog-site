import { createAPIFileRoute } from "@tanstack/react-start/api";
import { generateRssFeed } from "../content/feeds/rss";
import { getPostsByCategory, getCategoryWithCount } from "../content/api";
import { CATEGORY_SLUGS } from "../content/taxonomy/categories";
import { SITE_URL } from "../content/feeds/constants";
import type { CategorySlug } from "../content/types";

export const APIRoute = createAPIFileRoute("/category/$slug/rss.xml")({
  GET: ({ params }) => {
    const { slug } = params;
    if (!(CATEGORY_SLUGS as readonly string[]).includes(slug)) {
      return new Response("Not found", { status: 404 });
    }
    const category = getCategoryWithCount(slug)!;
    const posts = getPostsByCategory(slug as CategorySlug);
    return new Response(
      generateRssFeed({
        title: `${category.name} — Beyond the Basics`,
        description: category.desc,
        posts,
        selfUrl: `${SITE_URL}/category/${slug}/rss.xml`,
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
