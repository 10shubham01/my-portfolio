"use client"

import { useTheme } from "@/components/portfolio/theme-provider"

const QUOTE = "developing the web, thread by thread."

const CX = 100
const CY = 100
const RADIUS = 92
const SPOKES = 12
const RINGS = 8

function spokeAngles(count: number) {
  return Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2 - Math.PI / 2)
}

function ringPolygon(radius: number, angles: number[]) {
  return angles
    .map((angle) => {
      const x = CX + radius * Math.cos(angle)
      const y = CY + radius * Math.sin(angle)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
}

export function WebDoodleCard({ interactive }: { interactive: boolean }) {
  const { theme } = useTheme()
  const thread = theme === "dark" ? "rgba(163, 163, 163, 0.55)" : "rgba(120, 120, 120, 0.45)"
  const angles = spokeAngles(SPOKES)

  return (
    <div
      className="flex w-full flex-col gap-3"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <svg
        viewBox="0 0 200 200"
        className="aspect-square w-full"
        fill="none"
        aria-hidden
      >
        {angles.map((angle, i) => {
          const x = CX + RADIUS * Math.cos(angle)
          const y = CY + RADIUS * Math.sin(angle)
          return (
            <line
              key={`spoke-${i}`}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke={thread}
              strokeWidth={1}
            />
          )
        })}

        {Array.from({ length: RINGS }, (_, ring) => {
          const r = ((ring + 1) / RINGS) * RADIUS
          return (
            <polygon
              key={`ring-${ring}`}
              points={ringPolygon(r, angles)}
              stroke={thread}
              strokeWidth={1}
            />
          )
        })}
      </svg>

      <p className="font-mono text-[10px] leading-relaxed tracking-wide text-gray-400 italic dark:text-neutral-500">
        &ldquo;{QUOTE}&rdquo;
      </p>
    </div>
  )
}
