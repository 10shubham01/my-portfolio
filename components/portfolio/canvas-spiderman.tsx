"use client"

import { useEffect, useRef, useState } from "react"
import { SpiderManFigure, type SpideyLook } from "@/components/portfolio/spiderman-figure"
import { useSpidey } from "@/components/portfolio/spidey-context"
import { SPIDEY_FIGURE_VIEWBOX, SPIDEY_RENDER_HEIGHT, SPIDEY_RENDER_WIDTH } from "@/lib/spidey-position"

// How far (px) the cursor travels before Spidey looks "all the way" in that direction.
const LOOK_FALLOFF = 320

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function CanvasSpiderman() {
  const {
    position,
    dragging,
    mood,
    web,
    speech,
    beginDrag,
    moveDrag,
    endDrag,
    notifyActivity,
  } = useSpidey()
  const [hovered, setHovered] = useState(false)
  const [look, setLook] = useState<SpideyLook>({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const isDragging = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  // Eyes/head follow the cursor anywhere on the page (throttled to a frame).
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      notifyActivity()
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const el = wrapperRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        setLook({
          x: clamp((event.clientX - cx) / LOOK_FALLOFF, -1, 1),
          y: clamp((event.clientY - cy) / LOOK_FALLOFF, -1, 1),
        })
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [notifyActivity])

  // Occasional natural blink.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      const delay = 2600 + Math.random() * 3600
      timeout = setTimeout(() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 130)
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

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

  // Web thread from the anchor to Spidey while swinging.
  const threadDx = position.x - web.x
  const threadDy = position.y - web.y
  const threadLength = Math.hypot(threadDx, threadDy)
  const threadAngle = (Math.atan2(threadDy, threadDx) * 180) / Math.PI

  return (
    <>
      {web.visible ? (
        <div
          className="pointer-events-none absolute top-0 left-0 z-[100]"
          style={{
            transform: `translate3d(${web.x}px, ${web.y}px, 0) rotate(${threadAngle}deg)`,
            transformOrigin: "0 50%",
            width: threadLength,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(150,150,160,0) 0%, rgba(150,150,160,0.75) 12%, rgba(150,150,160,0.75) 100%)",
          }}
        >
          <span
            className="absolute -left-1 -top-1 h-2 w-2 rounded-full"
            style={{ background: "rgba(150,150,160,0.85)" }}
          />
        </div>
      ) : null}

      <div
        ref={wrapperRef}
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
          // Glide smoothly when summoned; follow instantly while dragged or swinging.
          transition:
            dragging || mood === "swing"
              ? "none"
              : "left 0.55s cubic-bezier(0.22, 1, 0.36, 1), top 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
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
          <SpiderManFigure
            hovered={hovered}
            dragging={dragging}
            mood={mood}
            look={look}
            blink={blink}
          />
        </svg>
      </div>

      {speech.visible && speech.text ? (
        <div
          className="pointer-events-none absolute z-[130]"
          style={{ left: position.x, top: position.y - SPIDEY_RENDER_HEIGHT * 0.5 }}
        >
          <div style={{ transform: "scale(calc(1 / var(--canvas-zoom, 1)))", transformOrigin: "center bottom" }}>
            <div
              className="relative -translate-x-1/2 -translate-y-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 font-sans text-[12px] whitespace-nowrap text-gray-700 shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {speech.text}
              <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
