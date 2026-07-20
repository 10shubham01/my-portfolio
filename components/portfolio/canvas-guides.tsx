"use client"

import { useEffect, useState } from "react"
import type { MeasureLine, SnapGuide } from "@/lib/canvas-snap"

// Figma's snap/measure red.
const GUIDE_COLOR = "#F24822"

const hairline = "calc(1px / var(--canvas-zoom, 1))"

// Snap guide lines shown while dragging a card. Rendered inside the zoomed
// canvas layer in world coordinates; updated imperatively through the
// registered setter so pointermove never re-renders the card tree.
export function SnapGuidesOverlay({
  register,
}: {
  register: (setGuides: (guides: SnapGuide[]) => void) => void
}) {
  const [guides, setGuides] = useState<SnapGuide[]>([])

  useEffect(() => {
    // Bail out when the guides stay empty so pointermove without a snap
    // doesn't re-render anything.
    register((next) => {
      setGuides((prev) => (prev.length === 0 && next.length === 0 ? prev : next))
    })
  }, [register])

  return (
    <>
      {guides.map((guide, index) => (
        <div
          key={index}
          className="pointer-events-none absolute"
          style={{
            backgroundColor: GUIDE_COLOR,
            zIndex: 200000,
            ...(guide.axis === "v"
              ? {
                  left: guide.position,
                  top: guide.start,
                  width: hairline,
                  height: guide.end - guide.start,
                }
              : {
                  left: guide.start,
                  top: guide.position,
                  width: guide.end - guide.start,
                  height: hairline,
                }),
          }}
        />
      ))}
    </>
  )
}

// Alt+hover distance readout between the selected card and the hovered card,
// drawn as red lines with px labels at their midpoint.
export function MeasureOverlay({ lines }: { lines: MeasureLine[] }) {
  return (
    <>
      {lines.map((line, index) => {
        const midX = (line.from.x + line.to.x) / 2
        const midY = (line.from.y + line.to.y) / 2

        return (
          <div key={index} className="pointer-events-none absolute inset-0" style={{ zIndex: 200000 }}>
            <div
              className="absolute"
              style={{
                backgroundColor: GUIDE_COLOR,
                ...(line.axis === "h"
                  ? {
                      left: Math.min(line.from.x, line.to.x),
                      top: line.from.y,
                      width: Math.abs(line.to.x - line.from.x),
                      height: hairline,
                    }
                  : {
                      left: line.from.x,
                      top: Math.min(line.from.y, line.to.y),
                      width: hairline,
                      height: Math.abs(line.to.y - line.from.y),
                    }),
              }}
            />
            <span
              className="absolute flex items-center justify-center rounded font-mono leading-none whitespace-nowrap text-white select-none"
              style={{
                left: line.axis === "h" ? midX : line.from.x,
                top: line.axis === "h" ? line.from.y : midY,
                transform:
                  line.axis === "h"
                    ? "translate(-50%, calc(6px / var(--canvas-zoom, 1)))"
                    : "translate(calc(6px / var(--canvas-zoom, 1)), -50%)",
                backgroundColor: GUIDE_COLOR,
                fontSize: "calc(10px / var(--canvas-zoom, 1))",
                padding:
                  "calc(2px / var(--canvas-zoom, 1)) calc(4px / var(--canvas-zoom, 1))",
                borderRadius: "calc(2px / var(--canvas-zoom, 1))",
              }}
            >
              {line.label}
            </span>
          </div>
        )
      })}
    </>
  )
}
