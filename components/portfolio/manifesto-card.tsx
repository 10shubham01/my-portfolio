"use client"

import { useFrameResize } from "@/components/portfolio/use-frame-resize"

interface Principle {
  id: string
  num: string
  label: string
  body?: string
}

const PRINCIPLES: Principle[] = [
  {
    id: "01",
    num: "01",
    label: "the system",
    body: "Architecture isn't just structure. It shapes experience.",
  },
  {
    id: "02",
    num: "02",
    label: "the details",
    body: "2px matters. Easing matters. Rhythm matters.",
  },
  {
    id: "03",
    num: "03",
    label: "the product",
    body: "Every technical decision becomes a user experience decision.",
  },
  {
    id: "04",
    num: "04",
    label: "the motion",
    body: "Transitions should guide, not perform.",
  },
  {
    id: "05",
    num: "05",
    label: "the restraint",
    body: "Complexity should stay behind the interface.",
  },
]

// Figma's measurement blue — the same accent the canvas already uses for
// selection corner-frames. Reusing it here so the ruler reads as part of the
// same measurement language.
const SCALE = "#18A0FB"

// ---- True-to-size ruler geometry -------------------------------------------
// CSS reference is 96px per inch, so at 100% zoom this is an actual 6" ruler,
// with the cm side derived from the real 1in = 2.54cm ratio.
const PPI = 96 // px per inch
const INCHES = 6
const PX_PER_MM = PPI / 25.4 // ≈ 3.7795
const RULER_W = 104 // width of the ruler body
const TOP = 14 // headroom for the 0 mark
const RULER_H = PPI * INCHES // 576
const SVG_H = TOP + RULER_H + 2

// Left edge = centimetres (mm graduations). Ticks grow inward from x=0.
const cmTicks = Array.from(
  { length: Math.floor(RULER_H / PX_PER_MM) + 1 },
  (_, m) => {
    const isCm = m % 10 === 0
    const isHalf = m % 5 === 0
    return {
      y: TOP + m * PX_PER_MM,
      len: isCm ? 22 : isHalf ? 13 : 8,
      cm: isCm ? m / 10 : null,
    }
  }
)

// Right edge = inches (1/16" graduations). Ticks grow inward from x=RULER_W.
const inchTicks = Array.from({ length: INCHES * 16 + 1 }, (_, s) => {
  const len =
    s % 16 === 0 ? 24 : s % 8 === 0 ? 16 : s % 4 === 0 ? 13 : s % 2 === 0 ? 9 : 8
  return {
    y: TOP + s * (PPI / 16),
    len,
    major: s % 16 === 0,
    inch: s % 16 === 0 ? s / 16 : null,
  }
})

function Ruler() {
  return (
    <svg
      width={RULER_W}
      height={SVG_H}
      viewBox={`0 0 ${RULER_W} ${SVG_H}`}
      fill="none"
      aria-hidden
      shapeRendering="crispEdges"
      className="text-foreground/70 dark:text-foreground/55"
    >
      {/* ruler body */}
      <rect
        x="0.5"
        y={TOP - 0.5}
        width={RULER_W - 1}
        height={RULER_H + 1}
        rx="3"
        stroke={`${SCALE}55`}
        strokeWidth="1"
        fill={`${SCALE}08`}
      />

      {/* centimetre graduations (left) */}
      {cmTicks.map((t, i) => (
        <line
          key={`cm-${i}`}
          x1="0.5"
          x2={t.len}
          y1={t.y}
          y2={t.y}
          stroke="currentColor"
          strokeWidth={t.len === 22 ? 1 : 0.75}
        />
      ))}
      {cmTicks
        .filter((t) => t.cm)
        .map((t) => (
          <text
            key={`cmn-${t.cm}`}
            x="27"
            y={t.y + 3}
            fontSize="9"
            fontFamily="var(--font-geist-mono, monospace)"
            fill="currentColor"
            textAnchor="start"
          >
            {t.cm}
          </text>
        ))}

      {/* inch graduations (right) */}
      {inchTicks.map((t, i) => (
        <line
          key={`in-${i}`}
          x1={RULER_W - 0.5}
          x2={RULER_W - t.len}
          y1={t.y}
          y2={t.y}
          stroke="currentColor"
          strokeWidth={t.major ? 1 : 0.75}
        />
      ))}
      {inchTicks
        .filter((t) => t.inch)
        .map((t) => (
          <text
            key={`inn-${t.inch}`}
            x={RULER_W - 28}
            y={t.y + 3}
            fontSize="9"
            fontFamily="var(--font-geist-mono, monospace)"
            fill="currentColor"
            textAnchor="end"
          >
            {t.inch}
          </text>
        ))}
    </svg>
  )
}

export function ManifestoCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: SVG_H, pointerEvents: interactive ? "auto" : "none" }}
    >
      {/* The full dual-scale ruler down the left */}
      <div className="absolute top-0 left-0">
        <Ruler />
      </div>

      {/* Each principle pinned to an inch mark — exactly 1 inch (96px) apart */}
      {PRINCIPLES.map((p, i) => {
        const y = TOP + (i + 1) * PPI // inch 1 → 5
        return (
          <div
            key={p.id}
            className="group/row absolute flex items-start gap-2.5"
            style={{ top: y, left: RULER_W, transform: "translateY(-8px)" }}
          >
            {/* guide from the inch tick out to the text */}
            <span
              aria-hidden
              className="mt-[7px] h-px w-3.5 shrink-0"
              style={{ backgroundColor: SCALE }}
            />
            <div className="flex flex-col gap-1" style={{ width: 300 }}>
              <span className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-foreground/70 transition-colors duration-200 group-hover/row:text-foreground/95 dark:text-foreground/50 dark:group-hover/row:text-foreground/75">
                {p.label}
              </span>
              {p.body && (
                <p className="font-paper text-[14px] leading-relaxed text-foreground/65 dark:text-foreground/45">
                  {p.body}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
