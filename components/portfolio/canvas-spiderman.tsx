"use client"

import { useRef, useState } from "react"
import { SpiderManFigure } from "@/components/portfolio/spiderman-figure"
import { useSpidey } from "@/components/portfolio/spidey-context"
import { SPIDEY_FIGURE_VIEWBOX, SPIDEY_RENDER_HEIGHT, SPIDEY_RENDER_WIDTH } from "@/lib/spidey-position"

export function CanvasSpiderman() {
  const { position, dragging, beginDrag, moveDrag, endDrag } = useSpidey()
  const [hovered, setHovered] = useState(false)
  const isDragging = useRef(false)

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    isDragging.current = true
    beginDrag(event.clientX, event.clientY)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    event.stopPropagation()
    moveDrag(event.clientX, event.clientY)
  }

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    event.stopPropagation()
    event.currentTarget.releasePointerCapture(event.pointerId)
    isDragging.current = false
    endDrag()
  }

  return (
    <div
      data-spidey
      className="absolute touch-none select-none"
      style={{
        left: position.x,
        top: position.y,
        width: SPIDEY_RENDER_WIDTH,
        height: SPIDEY_RENDER_HEIGHT,
        transform: "translate(-50%, -50%)",
        zIndex: dragging ? 200 : 101,
        cursor: dragging ? "grabbing" : "grab",
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => !dragging && setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <svg
        viewBox={`${SPIDEY_FIGURE_VIEWBOX.x} ${SPIDEY_FIGURE_VIEWBOX.y} ${SPIDEY_FIGURE_VIEWBOX.width} ${SPIDEY_FIGURE_VIEWBOX.height}`}
        className="h-full w-full"
        fill="none"
        aria-hidden
      >
        <defs>
          <filter id="eye-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={2.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <SpiderManFigure hovered={hovered} dragging={dragging} />
      </svg>
    </div>
  )
}
