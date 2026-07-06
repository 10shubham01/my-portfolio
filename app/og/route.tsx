import { ImageResponse } from "next/og"
import { CANVAS_ITEMS } from "@/lib/canvas-config"
import { SITE } from "@/lib/canvas-data"
import { getCanvasItemMeta } from "@/lib/canvas-meta"

export const runtime = "edge"

const SIZE = { width: 1200, height: 630 }

// Short uppercase eyebrow per card kind, mirroring the nav grouping.
function eyebrowFor(id: string | null): string {
  if (!id) return SITE.location
  const item = CANVAS_ITEMS.find((entry) => entry.id === id)
  switch (item?.type) {
    case "project":
      return "Project"
    case "work":
      return "Experience"
    case "skills":
      return "Skills"
    case "awards":
      return "Awards"
    case "github":
      return "GitHub"
    case "socials":
      return "Elsewhere"
    case "now":
      return "Right now"
    case "contact":
      return "Get in touch"
    case "webcam":
      return "Experiment"
    case "resume":
      return "Resume"
    case "manifesto":
      return "Principles"
    case "peerlist":
      return "Featured"
    default:
      return SITE.location
  }
}

// Load the site's Geist UI font so the card previews match the on-page type.
// fetch(new URL(...)) is the Next.js edge-runtime pattern for bundled assets.
async function loadFonts() {
  try {
    const [regular, medium, semibold] = await Promise.all([
      fetch(new URL("../fonts/Geist-400.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
      fetch(new URL("../fonts/Geist-500.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
      fetch(new URL("../fonts/Geist-600.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    ])
    return [
      { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
      { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    ]
  } catch {
    // Fall back to the system font if the font assets can't be loaded.
    return undefined
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawId = searchParams.get("to")
  const id = rawId && CANVAS_ITEMS.some((i) => i.id === rawId) ? rawId : null

  const fonts = await loadFonts()
  const { title, description } = getCanvasItemMeta(id)
  // getCanvasItemMeta suffixes card titles with " · Shubham Gupta"; drop it for
  // the headline since the name already shows in the footer.
  const headline = title.split(" · ")[0]
  const eyebrow = eyebrowFor(id)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f5f5f5",
          color: "#111827",
          fontFamily: "Geist, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#18A0FB" }} />
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 30, color: "#4b5563", maxWidth: 940, lineHeight: 1.35 }}>
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#6b7280",
          }}
        >
          <span>{SITE.name}</span>
          <span>{SITE.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    { ...SIZE, ...(fonts ? { fonts } : {}) }
  )
}
