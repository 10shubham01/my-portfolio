"use client"

import { useEffect, useRef, useState } from "react"
import type { CanvasItem } from "@/lib/canvas-config"

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
  onMove,
  zoomRef,
  suppressHover = false,
  children,
}: {
  item: CanvasItem
  selected: boolean
  onSelect: (item: CanvasItem) => void
  onMove: (id: string, x: number, y: number) => void
  zoomRef: React.RefObject<number>
  suppressHover?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const pointerActive = useRef(false)
  const moved = useRef(false)
  const dragStart = useRef({ px: 0, py: 0, wx: 0, wy: 0 })

  useEffect(() => {
    if (suppressHover) setHovered(false)
  }, [suppressHover])

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
        zIndex: selected ? 40 : 1,
      }}
      onPointerDown={(event) => {
        const isMobile = window.innerWidth < 768
        if (event.button !== 0) return
        if ((event.target as HTMLElement).closest("a, button, [role='button']")) return

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
      <span
        className="canvas-label font-sans mb-1.5 block text-[11px] tracking-wide select-none"
        style={{ color: hovered || selected ? "#18A0FB" : "#a3a3a3" }}
      >
        {item.label}
      </span>

      <div
        className="frame-content relative select-none"
        style={{
          width: item.width,
          height: item.height,
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
                className={`absolute ${position} bg-white`}
                style={{
                  width: handleSize,
                  height: handleSize,
                  borderWidth: outlineWidth,
                  borderStyle: "solid",
                  borderColor: "#18A0FB",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
