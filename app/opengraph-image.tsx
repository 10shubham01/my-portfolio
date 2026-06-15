import { ImageResponse } from "next/og"
import { SITE } from "@/lib/canvas-data"

export const runtime = "edge"
export const alt = `${SITE.name} — ${SITE.title}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
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
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#18A0FB",
            }}
          />
          {SITE.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em" }}>
            {SITE.name}
          </div>
          <div style={{ fontSize: 34, color: "#4b5563", maxWidth: 900, lineHeight: 1.35 }}>
            {SITE.title} at {SITE.company}. {SITE.tagline}
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
          <span>{SITE.url.replace("https://", "")}</span>
          <span>Portfolio canvas</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
