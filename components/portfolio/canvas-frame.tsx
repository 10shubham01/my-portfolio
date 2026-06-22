"use client"

import { Check, Link } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { CanvasItem } from "@/lib/canvas-config"
import { copyItemDeeplink } from "@/lib/canvas-deeplink"
import { getExperienceById } from "@/lib/experience"
import { cn } from "@/lib/utils"

const HANDLE_POSITIONS = [
  "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
]

export function CanvasFrame({
  item,
  selected,
  onSelect,
  onActivate,
  onMove,
  zoomRef,
  suppressHover = false,
  children,
}: {
  item: CanvasItem
  selected: boolean
  onSelect: (item: CanvasItem) => void
  onActivate: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  zoomRef: React.RefObject<number>
  suppressHover?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const pointerActive = useRef(false)
  const moved = useRef(false)
  const dragStart = useRef({ px: 0, py: 0, wx: 0, wy: 0 })

  useEffect(() => {
    if (suppressHover) setHovered(false)
  }, [suppressHover])

  useEffect(() => {
    if (!selected) setCopied(false)
  }, [selected])

  useEffect(() => {
    if (!dragging) return

    const style = document.createElement("style")
    style.textContent = "* { cursor: grabbing !important }"
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [dragging])

  const outlineWidth = "calc(1.5px / var(--canvas-zoom, 1))"
  const handleSize = "calc(8px / var(--canvas-zoom, 1))"
  // Selection readout stays a constant on-screen size regardless of zoom.
  const badgeFont = "calc(11px / var(--canvas-zoom, 1))"
  const badgeGap = "calc(7px / var(--canvas-zoom, 1))"
  const showHover = hovered && !suppressHover && !selected
  const outlineBase = {
    outlineWidth,
    outlineOffset: "calc(-1 * (1.5px / var(--canvas-zoom, 1)))",
  } as const

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActive.current) return
    pointerActive.current = false
    setDragging(false)

    if (moved.current) {
      const dx = event.clientX - dragStart.current.px
      const dy = event.clientY - dragStart.current.py
      const zoom = zoomRef.current ?? 1
      onMove(
        item.id,
        dragStart.current.wx + dx / zoom,
        dragStart.current.wy + dy / zoom
      )
    } else {
      onSelect(item)
    }
  }

  const workEntry = item.workId ? getExperienceById(item.workId) : undefined

  return (
    <div
      ref={frameRef}
      data-frame-id={item.id}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.width,
        touchAction: "none",
        zIndex: selected ? 100 : hovered && !suppressHover ? 10 : 1,
      }}
      onPointerDown={(event) => {
        const isMobile = window.innerWidth < 768
        if (event.button !== 0) return
        if ((event.target as HTMLElement).closest("a, button, [role='button']")) return

        onActivate(item.id)
        pointerActive.current = true
        moved.current = false
        dragStart.current = {
          px: event.clientX,
          py: event.clientY,
          wx: item.x,
          wy: item.y,
        }

        if (!isMobile) {
          frameRef.current?.setPointerCapture(event.pointerId)
        }
        setDragging(true)
      }}
      onPointerMove={(event) => {
        if (!pointerActive.current || window.innerWidth < 768) return

        const dx = event.clientX - dragStart.current.px
        const dy = event.clientY - dragStart.current.py

        if (!moved.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
          moved.current = true
        }

        if (!moved.current || !frameRef.current) return

        const zoom = zoomRef.current ?? 1
        frameRef.current.style.left = `${dragStart.current.wx + dx / zoom}px`
        frameRef.current.style.top = `${dragStart.current.wy + dy / zoom}px`
      }}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onDragStart={(event) => event.preventDefault()}
      onPointerEnter={() => {
        if (window.innerWidth >= 768 && !suppressHover) setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {item.type !== "tagline" && (
      <div className="mb-1.5">
        <span
          className={cn(
            "canvas-label inline-flex items-center gap-0 font-sans text-[11px] leading-none tracking-wide select-none",
            hovered || selected ? "text-[#18A0FB]" : "text-gray-400 dark:text-neutral-500"
          )}
        >
          {item.label}
          {workEntry && (
            <>
              <span className="mx-1 text-gray-300 dark:text-neutral-600">·</span>
              <span className="font-mono text-[#18A0FB]">{workEntry.period}</span>
            </>
          )}
          {selected && (
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={async (event) => {
                event.stopPropagation()
                const ok = await copyItemDeeplink(item.id)
                if (!ok) return
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1500)
              }}
              className="m-0 ml-[2px] inline-flex shrink-0 items-center border-0 bg-transparent p-0 leading-none text-inherit transition-opacity hover:opacity-80"
              aria-label={`Copy link to ${item.label}`}
            >
              {copied ? (
                <Check className="size-[11px]" strokeWidth={2} />
              ) : (
                <Link className="size-[11px]" strokeWidth={2} />
              )}
            </button>
          )}
        </span>
      </div>
      )}

      <div
        className="frame-content relative min-h-0 select-none overflow-visible"
        data-active={selected ? "true" : undefined}
        style={{
          width: item.width,
          height: item.height,
          minHeight: item.height,
          cursor: dragging ? "grabbing" : undefined,
        }}
      >
        {children}

        {showHover && (
          <div
            className="frame-border pointer-events-none absolute inset-0"
            style={{
              ...outlineBase,
              outlineStyle: "dashed",
              outlineColor: "#18A0FB",
            }}
          />
        )}

        {selected && !suppressHover && (
          <div
            className="frame-border pointer-events-none absolute inset-0"
            style={{
              ...outlineBase,
              outlineStyle: "solid",
              outlineColor: "#18A0FB",
              zIndex: 10,
            }}
          >
            {HANDLE_POSITIONS.map((position) => (
              <div
                key={position}
                className={cn("absolute", position)}
                style={{
                  width: handleSize,
                  height: handleSize,
                  borderWidth: outlineWidth,
                  borderStyle: "solid",
                  borderColor: "#18A0FB",
                  backgroundColor: "#18A0FB",
                }}
              />
            ))}
          </div>
        )}

        {/* Figma-style selection readout: position bottom-left, dimensions bottom-right */}
        {selected && !suppressHover && !dragging && (
          <>
            <span
              className="pointer-events-none absolute top-full left-0 font-mono leading-none whitespace-nowrap text-[#18A0FB] select-none"
              style={{ marginTop: badgeGap, fontSize: badgeFont, zIndex: 11 }}
            >
              X {Math.round(item.x)}  Y {Math.round(item.y)}
            </span>
            <span
              className="pointer-events-none absolute top-full right-0 font-mono leading-none whitespace-nowrap text-[#18A0FB] select-none"
              style={{ marginTop: badgeGap, fontSize: badgeFont, zIndex: 11 }}
            >
              {Math.round(item.width)} × {Math.round(item.height)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
