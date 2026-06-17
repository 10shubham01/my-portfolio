"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import { CANVAS_ITEMS } from "@/lib/canvas-data"
import type { CanvasItem } from "@/lib/canvas-config"
import { getDotColor } from "@/lib/theme"
import { useTheme } from "@/components/portfolio/theme-provider"
import {
  generateScatterLayout,
  getContentBounds,
  getDefaultSizes,
} from "@/lib/scatter-layout"
import { ANCHORED_ITEM_IDS, withAnchoredLayout } from "@/lib/canvas-layout"
import { buildCanvasNavGroups } from "@/lib/canvas-nav"
import { CanvasFrame } from "@/components/portfolio/canvas-frame"
import { RenderCanvasItem } from "@/components/portfolio/render-canvas-item"
import { CanvasMenu } from "@/components/portfolio/canvas-menu"
import { CanvasZoomControls } from "@/components/portfolio/canvas-zoom-controls"
import { CanvasSpotlight } from "@/components/portfolio/canvas-spotlight"
import { ShortcutsDialog } from "@/components/portfolio/shortcuts-dialog"
import { SpideyProvider } from "@/components/portfolio/spidey-context"
import { CanvasSpiderman } from "@/components/portfolio/canvas-spiderman"
import { getItemIdFromUrl, setItemDeeplink } from "@/lib/canvas-deeplink"
import { getCanvasItemMeta, DEFAULT_META } from "@/lib/canvas-meta"
import { getSpideyHomePosition } from "@/lib/spidey-position"
import { KONAMI_SEQUENCE } from "@/lib/portfolio-shortcuts"
import type { SpideyMood } from "@/components/portfolio/spidey-context"

const GRID_SPACING = 20
const ZOOM_MIN = 0.1
const ZOOM_MAX = 2.5
const ZOOM_STEP = 1.25

export function PortfolioCanvas() {
  const { canvasBg, toggleTheme } = useTheme()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panning, setPanning] = useState(false)
  const [ready, setReady] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [positions, setPositions] = useState(() =>
    withAnchoredLayout(generateScatterLayout(), getDefaultSizes())
  )
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
  const spideyApiRef = useRef<{
    setPosition: (position: { x: number; y: number }) => void
    setMood: (mood: SpideyMood) => void
  } | null>(null)
  const konamiIndexRef = useRef(0)
  const deeplinkFocusPending = useRef(
    typeof window !== "undefined" && !!getItemIdFromUrl(window.location.search)
  )

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
    deeplinkFocusPending.current = false
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
    setItemDeeplink(null, true)
    applyTransform(clamped.x, clamped.y, zoom, true)
  }, [applyTransform, clampPan, clampZoom])

  const setSpideyMoodForItem = useCallback((item: CanvasItem) => {
    if (item.type === "github" || item.type === "project" || item.type === "work") {
      spideyApiRef.current?.setMood("peek")
      return
    }
    spideyApiRef.current?.setMood("idle")
  }, [])

  useEffect(() => {
    document.title = getCanvasItemMeta(selectedId).title
    return () => {
      document.title = DEFAULT_META.title
    }
  }, [selectedId])

  const summonSpideyToSelection = useCallback(() => {
    if (!selectedId) return
    const pos = positions[selectedId]
    const size = sizes[selectedId]
    if (!pos || !size) return

    spideyApiRef.current?.setPosition({
      x: pos.x + size.w / 2,
      y: pos.y + size.h / 2,
    })
    spideyApiRef.current?.setMood("peek")
  }, [positions, selectedId, sizes])

  const triggerKonamiEasterEgg = useCallback(() => {
    spideyApiRef.current?.setMood("excited")
    const centerX = (boundsRef.current.minX + boundsRef.current.maxX) / 2
    const centerY = (boundsRef.current.minY + boundsRef.current.maxY) / 2
    spideyApiRef.current?.setPosition({ x: centerX, y: centerY })
    window.setTimeout(() => spideyApiRef.current?.setMood("idle"), 4000)
    posthog.capture("konami_code_triggered")
  }, [])

  const focusItem = useCallback(
    (
      item: CanvasItem,
      options?: {
        updateUrl?: boolean
        replaceUrl?: boolean
        position?: { x: number; y: number }
        size?: { w: number; h: number }
      }
    ) => {
      const pos =
        options?.position ?? positions[item.id] ?? { x: item.x, y: item.y }
      const size =
        options?.size ?? sizes[item.id] ?? { w: item.width, h: item.height }
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

      if (options?.updateUrl !== false) {
        setItemDeeplink(item.id, options?.replaceUrl ?? false)
      }

      posthog.capture("canvas_item_focused", {
        item_id: item.id,
        item_type: item.type,
        item_label: item.label,
      })
      if (item.type === "project") {
        posthog.capture("project_card_viewed", {
          item_id: item.id,
          item_label: item.label,
        })
      }
      if (item.type === "work") {
        posthog.capture("experience_card_viewed", {
          item_id: item.id,
          item_label: item.label,
        })
      }

      setSpideyMoodForItem(item)
    },
    [applyTransform, positions, sizes, setSpideyMoodForItem]
  )

  const resetView = useCallback(
    (options?: { updateUrl?: boolean; replaceUrl?: boolean }) => {
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

      if (options?.updateUrl !== false) {
        setItemDeeplink(null, options?.replaceUrl ?? false)
      }
    },
    [applyTransform]
  )

  const resetCanvasLayout = useCallback(() => {
    const baseSizes = getDefaultSizes()
    const basePositions = withAnchoredLayout(generateScatterLayout(), baseSizes)
    setSizes(baseSizes)
    setPositions(basePositions)

    const webPos = basePositions["web-doodle"]
    const webSize = baseSizes["web-doodle"]
    if (webPos && webSize) {
      spideyApiRef.current?.setPosition(
        getSpideyHomePosition(webPos.x, webPos.y, webSize.w)
      )
    }

    const intro = CANVAS_ITEMS.find((item) => item.id === "intro")
    if (intro) {
      focusItem(intro, {
        position: basePositions.intro,
        size: baseSizes.intro,
        replaceUrl: true,
      })
    }
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
    setPositions((current) => {
      const anchored = withAnchoredLayout(current, sizes, { anchorToIntro: false })
      const unchanged = ANCHORED_ITEM_IDS.every((id) => {
        const next = anchored[id]
        const prev = current[id]
        return prev && next.x === prev.x && next.y === prev.y
      })
      if (unchanged) return current
      return anchored
    })
  }, [
    sizes.now?.h,
    sizes.vscode?.h,
    sizes.awards?.h,
    sizes["work-credilio"]?.h,
    sizes["work-webmd"]?.h,
    sizes["work-mountblue"]?.h,
    sizes.github?.h,
    sizes.socials?.h,
    positions["work-credilio"]?.x,
    positions["work-credilio"]?.y,
    positions["work-webmd"]?.x,
    positions["work-webmd"]?.y,
  ])

  useEffect(() => {
    const deeplinkId = getItemIdFromUrl(window.location.search)
    const target =
      (deeplinkId && CANVAS_ITEMS.find((item) => item.id === deeplinkId)) ||
      CANVAS_ITEMS.find((item) => item.type === "intro")
    if (!target) return

    focusItem(target, {
      updateUrl: false,
      replaceUrl: true,
      position: positions[target.id] ?? { x: target.x, y: target.y },
      size: sizes[target.id] ?? { w: target.width, h: target.height },
    })
    setReady(true)
    // Intentionally run once on mount with the initial layout snapshot above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready || !deeplinkFocusPending.current || !selectedId) return

    const deeplinkId = getItemIdFromUrl(window.location.search)
    if (!deeplinkId || deeplinkId !== selectedId) {
      deeplinkFocusPending.current = false
      return
    }

    const item = CANVAS_ITEMS.find((entry) => entry.id === deeplinkId)
    if (item) focusItem(item, { updateUrl: false })
  }, [ready, selectedId, positions, sizes, focusItem])

  useEffect(() => {
    if (!ready) return

    const timer = window.setTimeout(() => {
      deeplinkFocusPending.current = false
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [ready])

  useEffect(() => {
    if (ready) {
      applyTransform(panRef.current.x, panRef.current.y, zoomRef.current, false)
    }
  }, [ready, applyTransform])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = document.activeElement?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSpotlightOpen(true)
        posthog.capture("spotlight_opened", { trigger: "keyboard_shortcut" })
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return

      const key = event.key.toLowerCase()
      if (key === "r") {
        resetCanvasLayout()
      } else if (key === "d") {
        toggleTheme()
      } else if (key === "s") {
        summonSpideyToSelection()
      } else if (key === "?") {
        setShortcutsOpen(true)
      } else if (KONAMI_SEQUENCE[konamiIndexRef.current] === event.key) {
        konamiIndexRef.current += 1
        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          konamiIndexRef.current = 0
          triggerKonamiEasterEgg()
        }
      } else {
        konamiIndexRef.current = event.key === KONAMI_SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resetCanvasLayout, toggleTheme, summonSpideyToSelection, triggerKonamiEasterEgg])

  useEffect(() => {
    if (!ready) return

    const onPopState = () => {
      const id = getItemIdFromUrl(window.location.search)
      if (id) {
        const item = CANVAS_ITEMS.find((entry) => entry.id === id)
        if (item) focusItem(item, { updateUrl: false })
        return
      }

      resetView({ updateUrl: false })
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [ready, focusItem, resetView])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (spotlightOpen) {
          setSpotlightOpen(false)
          return
        }
        if (shortcutsOpen) {
          setShortcutsOpen(false)
          return
        }
        if (infoOpen) return
        resetView()
        return
      }

      if (spotlightOpen || shortcutsOpen) return

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
  }, [focusItem, resetView, selectedId, spotlightOpen, shortcutsOpen, infoOpen])

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
    if (spotlightOpen || shortcutsOpen || infoOpen) return

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    const target = event.target as HTMLElement
    const frame = target.closest("[data-frame-id]")
    const interactive = target.closest("a, button, input, [role='button']")
    const spidey = target.closest("[data-spidey]")
    clickedFrameId.current = frame?.getAttribute("data-frame-id") ?? null

    if (pointers.current.size === 1) {
      if (event.button !== 0 || interactive || spidey) return

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
  }, [beginInteraction, spotlightOpen, shortcutsOpen, infoOpen])

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

  const contentBounds = getContentBounds(positions, sizes)

  return (
    <SpideyProvider
      panRef={panRef}
      zoomRef={zoomRef}
      bounds={contentBounds}
      positions={positions}
      sizes={sizes}
      registerApi={(api) => {
        spideyApiRef.current = api
      }}
    >
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        cursor: panning ? "grabbing" : "default",
        touchAction: "none",
        background: canvasBg,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(event) => {
        event.preventDefault()
        setMenuAnchor({ x: event.clientX, y: event.clientY })
        setInfoOpen(true)
      }}
    >
      <div
        ref={dotsRef}
        className="canvas-dots"
        style={{
          backgroundImage: `radial-gradient(circle, ${getDotColor(canvasBg)} 1px, transparent 1px)`,
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
        <CanvasSpiderman />
      </div>

      <CanvasMenu
        open={infoOpen}
        onOpenChange={(open) => {
          setInfoOpen(open)
          if (!open) setMenuAnchor(null)
        }}
        anchor={menuAnchor}
        selectedId={selectedId}
        groups={buildCanvasNavGroups()}
        onNavigateToItem={(id) => {
          const item = CANVAS_ITEMS.find((entry) => entry.id === id)
          if (item) focusItem(item)
          setInfoOpen(false)
          setMenuAnchor(null)
        }}
        onResetCanvas={resetCanvasLayout}
      />

      <CanvasZoomControls
        zoom={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomTo100}
        onFitAll={fitAll}
        onOpenSpotlight={() => {
          setSpotlightOpen(true)
          posthog.capture("spotlight_opened", { trigger: "toolbar_button" })
        }}
      />
    </div>

    <CanvasSpotlight
      open={spotlightOpen}
      onOpenChange={setSpotlightOpen}
      onNavigate={(id) => {
        const item = CANVAS_ITEMS.find((entry) => entry.id === id)
        if (item) focusItem(item)
      }}
      onFitAll={fitAll}
      onResetLayout={resetCanvasLayout}
      onShowShortcuts={() => setShortcutsOpen(true)}
    />

    <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </SpideyProvider>
  )
}
