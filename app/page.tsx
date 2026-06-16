import type { Metadata } from "next"

import { PortfolioCanvas } from "@/components/portfolio/portfolio-canvas"
import { ThemeProvider } from "@/components/portfolio/theme-provider"
import { getItemIdFromUrl } from "@/lib/canvas-deeplink"
import { getCanvasItemMeta } from "@/lib/canvas-meta"

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
  return {
    title,
    description,
    openGraph: { title, description },
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
