import type { Metadata } from "next"

import { PortfolioCanvas } from "@/components/portfolio/portfolio-canvas"
import { ThemeProvider } from "@/components/portfolio/theme-provider"
import { buildItemDeeplink, getItemIdFromUrl } from "@/lib/canvas-deeplink"
import { getCanvasItemMeta } from "@/lib/canvas-meta"
import { SITE } from "@/lib/canvas-data"

const PARAM = "to"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const raw = params[PARAM]
  const id = getItemIdFromUrl(typeof raw === "string" ? `?${PARAM}=${raw}` : "")

  if (!id) return {}

  const { title, description } = getCanvasItemMeta(id)
  const canonical = buildItemDeeplink(id, SITE.url)
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { title, description },
  }
}

export default function Page() {
  return (
    <ThemeProvider>
      <PortfolioCanvas />
    </ThemeProvider>
  )
}
