import type { Metadata } from "next"

import { PortfolioCanvas } from "@/components/portfolio/portfolio-canvas"
import { ThemeProvider } from "@/components/portfolio/theme-provider"
import { CanvasA11yNav } from "@/components/portfolio/canvas-a11y-nav"
import { buildItemDeeplink, getItemIdFromUrl } from "@/lib/canvas-deeplink"
import { getCanvasItemMeta } from "@/lib/canvas-meta"
import { buildCanvasItemJsonLd } from "@/lib/structured-data"
import { SITE } from "@/lib/canvas-data"

const PARAM = "to"

function idFromSearchParams(raw: string | string[] | undefined): string | null {
  return getItemIdFromUrl(typeof raw === "string" ? `?${PARAM}=${raw}` : "")
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const id = idFromSearchParams(params[PARAM])

  if (!id) return {}

  const { title, description } = getCanvasItemMeta(id)
  const canonical = buildItemDeeplink(id, SITE.url)
  const ogImage = `${SITE.url}/og?to=${id}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: [ogImage] },
    twitter: { title, description, images: [ogImage] },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const id = idFromSearchParams(params[PARAM])
  const jsonLd = buildCanvasItemJsonLd(id)

  return (
    <ThemeProvider>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CanvasA11yNav />
      <main id="canvas-main">
        <PortfolioCanvas />
      </main>
    </ThemeProvider>
  )
}
