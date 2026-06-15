"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CANVAS_ITEMS, DEFAULT_BG } from "@/lib/canvas-data"
import type { CanvasItem } from "@/lib/canvas-config"
import {
  generateScatterLayout,
  getContentBounds,
  getDefaultSizes,
} from "@/lib/scatter-layout"
import { CanvasFrame } from "@/components/portfolio/canvas-frame"
import { RenderCanvasItem } from "@/components/portfolio/render-canvas-item"
import { CanvasMenu } from "@/components/portfolio/canvas-menu"
import { CanvasZoomControls } from "@/components/portfolio/canvas-zoom-controls"

const GRID_SPACING = 20
const ZOOM_MIN = 0.4
const ZOOM_MAX = 2.5
const ZOOM_STEP = 1.25

function getDotColor(hex: string) {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return "rgba(0, 0, 0, 0.12)"

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.14)"
}

export function PortfolioCanvas() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panning, setPanning] = useState(false)
  const [ready, setReady] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [bgColor, setBgColor] = useState(DEFAULT_BG)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [positions, setPositions] = useState(generateScatterLayout)
  const [sizes, setSizes] = useState(getDefaultSizes)

  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const panRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const isPanning = useRef(false)
  const didPan = useRef(false)
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<number | null>(null)
  const pinchZoomStart = useRef(1)
  const clickedFrameId = useRef<string | null>(null)
  const boundsRef = useRef(getContentBounds(positions, sizes))

  useEffect(() => {
    boundsRef.current = getContentBounds(positions, sizes)
  }, [positions, sizes])

  const clampPan = useCallback((x: number, y: number, zoom: number) => {
    const { minX, maxX, minY, maxY } = boundsRef.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    const padding = vw < 768 ? 40 : 120

    return {
      x: Math.min(Math.max(x, padding - maxX * zoom), vw - padding - minX * zoom),
      y: Math.min(Math.max(y, padding - maxY * zoom), vh - padding - minY * zoom),
    }
  }, [])

  const interactionEndRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [interacting, setInteracting] = useState(false)

  const beginInteraction = useCallback(() => {
    setInteracting(true)
    if (canvasRef.current) {
      canvasRef.current.style.willChange = "transform"
    }
    clearTimeout(interactionEndRef.current)
  }, [])

  const endInteractionSoon = useCallback(() => {
    clearTimeout(interactionEndRef.current)
    interactionEndRef.current = setTimeout(() => {
      setInteracting(false)
      if (canvasRef.current) {
        canvasRef.current.style.willChange = ""
      }
    }, 120)
  }, [])

  const applyTransform = useCallback(
    (x: number, y: number, zoom: number, animate = false) => {
      const transition = "0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      const rx = Math.round(x)
      const ry = Math.round(y)
      const spacing = GRID_SPACING * zoom

      if (canvasRef.current) {
        canvasRef.current.style.transition = animate
          ? `transform ${transition}, --canvas-zoom ${transition}`
          : "none"
        canvasRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${zoom})`

        const zoomStr = String(zoom)
        if (canvasRef.current.style.getPropertyValue("--canvas-zoom") !== zoomStr) {
          canvasRef.current.style.setProperty("--canvas-zoom", zoomStr)
        }
      }

      if (dotsRef.current) {
        dotsRef.current.style.transition = animate
          ? `background-position ${transition}, background-size ${transition}`
          : "none"
        dotsRef.current.style.backgroundSize = `${spacing}px ${spacing}px`
        dotsRef.current.style.backgroundPosition = `${rx}px ${ry}px`
      }

      setZoomLevel(zoom)
    },
    []
  )

  const clampZoom = useCallback((zoom: number) => {
    return Math.min(Math.max(zoom, ZOOM_MIN), ZOOM_MAX)
  }, [])

  const zoomAtViewportCenter = useCallback(
    (nextZoom: number, animate = true) => {
      const clampedZoom = clampZoom(nextZoom)
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const ratio = clampedZoom / zoomRef.current
      const x = centerX - (centerX - panRef.current.x) * ratio
      const y = centerY - (centerY - panRef.current.y) * ratio
      const clamped = clampPan(x, y, clampedZoom)

      zoomRef.current = clampedZoom
      panRef.current = clamped
      applyTransform(clamped.x, clamped.y, clampedZoom, animate)
    },
    [applyTransform, clampPan, clampZoom]
  )

  const zoomIn = useCallback(() => {
    zoomAtViewportCenter(zoomRef.current * ZOOM_STEP)
  }, [zoomAtViewportCenter])

  const zoomOut = useCallback(() => {
    zoomAtViewportCenter(zoomRef.current / ZOOM_STEP)
  }, [zoomAtViewportCenter])

  const zoomTo100 = useCallback(() => {
    zoomAtViewportCenter(1)
  }, [zoomAtViewportCenter])

  const fitAll = useCallback(() => {
    const { minX, maxX, minY, maxY } = boundsRef.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    const padding = vw < 768 ? 48 : 120
    const contentW = maxX - minX
    const contentH = maxY - minY
    const zoom = clampZoom(
      Math.min((vw - 2 * padding) / contentW, (vh - 2 * padding) / contentH)
    )
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const x = vw / 2 - cx * zoom
    const y = vh / 2 - cy * zoom
    const clamped = clampPan(x, y, zoom)

    zoomRef.current = zoom
    panRef.current = clamped
    setSelectedId(null)
    applyTransform(clamped.x, clamped.y, zoom, true)
  }, [applyTransform, clampPan, clampZoom])

  const focusItem = useCallback(
    (item: CanvasItem) => {
      const pos = positions[item.id] ?? { x: item.x, y: item.y }
      const size = sizes[item.id] ?? { w: item.width, h: item.height }
      const vw = window.innerWidth
      const vh = window.innerHeight
      const isMobile = vw < 768
      const isTall = size.h > size.w
      const padding = isMobile ? 24 : 80

      const zoom = Math.min(
        (vw - 2 * (isMobile && isTall ? 16 : padding)) / size.w,
        (vh - 2 * (isMobile ? 48 : padding)) / size.h,
        isMobile ? 1.2 : 1.5
      )

      const x = vw / 2 - (pos.x + size.w / 2) * zoom
      const y = vh / 2 - (pos.y + size.h / 2) * zoom

      panRef.current = { x, y }
      zoomRef.current = zoom
      setSelectedId(item.id)
      applyTransform(x, y, zoom, true)
    },
    [applyTransform, positions, sizes]
  )

  const resetView = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const zoom = vw < 768 ? 0.6 : 1
    const cx = vw / 2
    const cy = vh / 2
    const contentX = (cx - panRef.current.x) / zoomRef.current
    const contentY = (cy - panRef.current.y) / zoomRef.current
    const x = cx - contentX * zoom
    const y = cy - contentY * zoom

    panRef.current = { x, y }
    zoomRef.current = zoom
    setSelectedId(null)
    applyTransform(x, y, zoom, true)
  }, [applyTransform])

  const resetToIntro = useCallback(() => {
    const intro = CANVAS_ITEMS.find((item) => item.id === "intro")
    if (intro) focusItem(intro)
  }, [focusItem])

  const activateItem = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setPositions((current) => ({
      ...current,
      [id]: { ...current[id], x, y },
    }))
  }, [])

  const resizeItem = useCallback((id: string, width: number, height: number) => {
    setSizes((current) => {
      const rounded = { w: Math.round(width), h: Math.round(height) }
      if (current[id]?.w === rounded.w && current[id]?.h === rounded.h) return current
      return { ...current, [id]: rounded }
    })
  }, [])

  useEffect(() => {
    const intro = CANVAS_ITEMS.find((item) => item.type === "intro")
    if (!intro) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const isMobile = vw < 768
    const padding = isMobile ? 24 : 80

    const zoom = Math.min(
      (vw - 2 * (isMobile && intro.height > intro.width ? 16 : padding)) / intro.width,
      (vh - 2 * (isMobile ? 48 : padding)) / intro.height,
      isMobile ? 1.2 : 1.5
    )

    panRef.current = {
      x: vw / 2 - (intro.x + intro.width / 2) * zoom,
      y: vh / 2 - (intro.y + intro.height / 2) * zoom,
    }
    zoomRef.current = zoom
    setSelectedId("intro")
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) {
      applyTransform(panRef.current.x, panRef.current.y, zoomRef.current, false)
    }
  }, [ready, applyTransform])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return
      if (
        event.key.toLowerCase() === "r" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        resetToIntro()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resetToIntro])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetView()
        return
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault()
        const currentIndex = CANVAS_ITEMS.findIndex((item) => item.id === selectedId)
        const nextIndex =
          event.key === "ArrowRight"
            ? (currentIndex + 1) % CANVAS_ITEMS.length
            : (currentIndex - 1 + CANVAS_ITEMS.length) % CANVAS_ITEMS.length
        const nextItem = CANVAS_ITEMS[nextIndex]
        if (nextItem) focusItem(nextItem)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [focusItem, resetView, selectedId])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !ready) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      beginInteraction()
      endInteractionSoon()

      if (event.ctrlKey || event.metaKey) {
        const delta = event.deltaMode === 1 ? 10 * event.deltaY : event.deltaY
        const nextZoom = clampZoom(zoomRef.current * Math.pow(0.994, delta))
        const ratio = nextZoom / zoomRef.current
        const x = event.clientX - (event.clientX - panRef.current.x) * ratio
        const y = event.clientY - (event.clientY - panRef.current.y) * ratio
        const clamped = clampPan(x, y, nextZoom)

        zoomRef.current = nextZoom
        panRef.current = clamped
        applyTransform(clamped.x, clamped.y, nextZoom, false)
      } else {
        const multiplier = event.deltaMode === 1 ? 30 : 1.3
        const clamped = clampPan(
          panRef.current.x - event.deltaX * multiplier,
          panRef.current.y - event.deltaY * multiplier,
          zoomRef.current
        )
        panRef.current = clamped
        applyTransform(clamped.x, clamped.y, zoomRef.current, false)
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [ready, applyTransform, clampPan, clampZoom, beginInteraction, endInteractionSoon])

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    const target = event.target as HTMLElement
    const frame = target.closest("[data-frame-id]")
    const interactive = target.closest("a, button, input, [role='button']")
    clickedFrameId.current = frame?.getAttribute("data-frame-id") ?? null

    if (pointers.current.size === 1) {
      if (event.button !== 0 || interactive) return

      const isMobile = window.innerWidth < 768
      if (frame && !isMobile) return

      isPanning.current = true
      didPan.current = false
      panStart.current = {
        x: event.clientX,
        y: event.clientY,
        ox: panRef.current.x,
        oy: panRef.current.y,
      }
      containerRef.current?.setPointerCapture(event.pointerId)
      canvasRef.current && (canvasRef.current.style.transition = "none")
      beginInteraction()
      setPanning(true)
    } else if (pointers.current.size === 2) {
      const points = Array.from(pointers.current.values())
      pinchStart.current = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
      pinchZoomStart.current = zoomRef.current
      canvasRef.current && (canvasRef.current.style.transition = "none")
      beginInteraction()
    }
  }, [beginInteraction])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(event.pointerId)) return

      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointers.current.size === 1 && isPanning.current) {
        const dx = event.clientX - panStart.current.x
        const dy = event.clientY - panStart.current.y

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didPan.current = true

        const clamped = clampPan(
          panStart.current.ox + dx,
          panStart.current.oy + dy,
          zoomRef.current
        )
        panRef.current = clamped
        applyTransform(clamped.x, clamped.y, zoomRef.current, false)
      } else if (pointers.current.size === 2) {
        didPan.current = true
        const points = Array.from(pointers.current.values())
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)

        if (pinchStart.current && pinchStart.current > 0) {
          const nextZoom = clampZoom(pinchZoomStart.current * (distance / pinchStart.current))
          const centerX = (points[0].x + points[1].x) / 2
          const centerY = (points[0].y + points[1].y) / 2
          const ratio = nextZoom / zoomRef.current
          const x = centerX - (centerX - panRef.current.x) * ratio
          const y = centerY - (centerY - panRef.current.y) * ratio
          const clamped = clampPan(x, y, nextZoom)

          zoomRef.current = nextZoom
          panRef.current = clamped
          applyTransform(clamped.x, clamped.y, nextZoom, false)
        }
      }
    },
    [applyTransform, clampPan, clampZoom]
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointers.current.delete(event.pointerId)

      if (pointers.current.size === 0) {
        if (isPanning.current) {
          isPanning.current = false
          setPanning(false)
          endInteractionSoon()

          if (!didPan.current && clickedFrameId.current) {
            const item = CANVAS_ITEMS.find((entry) => entry.id === clickedFrameId.current)
            if (item) focusItem(item)
          } else if (!didPan.current) {
            resetView()
          }

          pinchStart.current = null
          clickedFrameId.current = null
        }
      } else if (pointers.current.size === 1) {
        const point = pointers.current.values().next().value
        if (point) {
          panStart.current = {
            x: point.x,
            y: point.y,
            ox: panRef.current.x,
            oy: panRef.current.y,
          }
        }
        pinchStart.current = null
      }
    },
    [focusItem, resetView, endInteractionSoon]
  )

  if (!ready) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        cursor: panning ? "grabbing" : "default",
        touchAction: "none",
        background: bgColor,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={dotsRef}
        className="canvas-dots"
        style={{
          backgroundImage: `radial-gradient(circle, ${getDotColor(bgColor)} 1px, transparent 1px)`,
        }}
      />

      <div
        ref={canvasRef}
        className="portfolio-canvas"
        style={{ position: "absolute", top: 0, left: 0, transformOrigin: "0 0" }}
      >
        {[...CANVAS_ITEMS]
          .sort((a, b) => {
            if (a.id === selectedId) return 1
            if (b.id === selectedId) return -1
            return 0
          })
          .map((item) => {
          const pos = positions[item.id] ?? { x: item.x, y: item.y }
          const size = sizes[item.id] ?? { w: item.width, h: item.height }
          const frameItem: CanvasItem = {
            ...item,
            x: pos.x,
            y: pos.y,
            width: size.w,
            height: size.h,
          }

          return (
            <CanvasFrame
              key={item.id}
              item={frameItem}
              selected={selectedId === item.id}
              onSelect={focusItem}
              onActivate={activateItem}
              onMove={moveItem}
              zoomRef={zoomRef}
              suppressHover={panning || interacting}
            >
              <RenderCanvasItem
                item={item}
                frameItem={frameItem}
                active={selectedId === item.id}
                onResize={(width, height) => resizeItem(item.id, width, height)}
              />
            </CanvasFrame>
          )
        })}
      </div>

      <CanvasMenu
        open={infoOpen}
        onOpenChange={setInfoOpen}
        selectedId={selectedId}
        items={CANVAS_ITEMS.map((item) => ({ id: item.id, label: item.label }))}
        onNavigateToItem={(id) => {
          const item = CANVAS_ITEMS.find((entry) => entry.id === id)
          if (item) focusItem(item)
          setInfoOpen(false)
        }}
        onResetCanvas={resetToIntro}
      />

      <CanvasZoomControls
        zoom={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomTo100}
        onFitAll={fitAll}
      />
    </div>
  )
}
