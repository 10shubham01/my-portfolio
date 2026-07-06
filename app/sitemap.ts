import type { MetadataRoute } from "next"
import { SITE } from "@/lib/canvas-data"
import { buildItemDeeplink } from "@/lib/canvas-deeplink"
import { getIndexableCanvasItemIds } from "@/lib/canvas-meta"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const root: MetadataRoute.Sitemap[number] = {
    url: SITE.url,
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
  }

  const cards: MetadataRoute.Sitemap = getIndexableCanvasItemIds().map((id) => ({
    url: buildItemDeeplink(id, SITE.url),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [root, ...cards]
}
