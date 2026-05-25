import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { DEV_UTILS } from "@/lib/dev-utils-data";
import { getAllWritings } from "@/lib/writings";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/writings"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const writingRoutes = getAllWritings().map(({ slug, frontmatter }) => ({
    url: absoluteUrl(`/writings/${slug}`),
    lastModified: frontmatter.date ? new Date(frontmatter.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const utilRoutes = [
    {
      url: absoluteUrl("/writings/utils"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
    ...DEV_UTILS.map((util) => ({
      url: absoluteUrl(`/writings/utils/${util.id}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...routes, ...writingRoutes, ...utilRoutes];
}
