"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { CANVAS_ITEMS } from "@/lib/canvas-config"
import {
  clampSpideyPosition,
  getSpideyHomePosition,
} from "@/lib/spidey-position"
import type { Position, Size } from "@/lib/scatter-layout"

export type SpideyMood = "idle" | "excited" | "dance" | "peek" | "swing"

export type TravelOptions = {
  /** Triggered by autonomous wandering (not a user action). */
  wander?: boolean
  /** Mood to hold when he lands. Defaults to "peek". */
  endMood?: SpideyMood
}

type SpideyApi = {
  setPosition: (position: { x: number; y: number }) => void
  travelTo: (position: { x: number; y: number }, options?: TravelOptions) => void
  setMood: (mood: SpideyMood) => void
  say: (text: string, durationMs?: number) => void
}

type WebState = { x: number; y: number; visible: boolean }
type SpeechState = { text: string; visible: boolean }

type SpideyContextValue = {
  position: { x: number; y: number }
  dragging: boolean
  mood: SpideyMood
  web: WebState
  speech: SpeechState
  beginDrag: (clientX: number, clientY: number) => void
  moveDrag: (clientX: number, clientY: number) => void
  endDrag: () => void
  setMood: (mood: SpideyMood) => void
  travelTo: (position: { x: number; y: number }, options?: TravelOptions) => void
  say: (text: string, durationMs?: number) => void
  notifyActivity: () => void
}

const SpideyContext = createContext<SpideyContextValue | null>(null)

// Cards worth visiting while wandering (skip decorative/utility items).
const WANDER_TYPES = new Set(["project", "work", "github", "awards", "skills", "now"])

const IDLE_BEFORE_WANDER_MS = 15000000000000
const WANDER_INTERVAL_MS = 15000000000000

const WANDER_QUIPS = [
  "psst — press T for the tour.",
  "drag me anywhere you like.",
  "⌘K opens the spotlight.",
  "nice spot for a web, huh?",
  "still here? let's explore.",
]

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now()
}

function getInitialPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
) {
  const item = CANVAS_ITEMS.find((entry) => entry.id === "web-doodle")
  if (!item) return { x: 0, y: 0 }

  const pos = positions[item.id] ?? { x: item.x, y: item.y }
  const size = sizes[item.id] ?? { w: item.width, h: item.height }

  return getSpideyHomePosition(pos.x, pos.y, size.w)
}

export function SpideyProvider({
  children,
  panRef,
  zoomRef,
  bounds,
  positions,
  sizes,
  registerApi,
}: {
  children: ReactNode
  panRef: React.RefObject<{ x: number; y: number }>
  zoomRef: React.RefObject<number>
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
  positions: Record<string, Position>
  sizes: Record<string, Size>
  registerApi?: (api: SpideyApi) => void
}) {
  const [position, setPosition] = useState(() => getInitialPosition(positions, sizes))
  const [dragging, setDragging] = useState(false)
  const [mood, setMoodState] = useState<SpideyMood>("idle")
  const [web, setWeb] = useState<WebState>({ x: 0, y: 0, visible: false })
  const [speech, setSpeech] = useState<SpeechState>({ text: "", visible: false })

  const dragOffset = useRef({ x: 0, y: 0 })
  const positionRef = useRef(position)
  const boundsRef = useRef(bounds)
  const positionsRef = useRef(positions)
  const sizesRef = useRef(sizes)
  const draggingRef = useRef(false)
  const travelTokenRef = useRef(0)
  const travelingRef = useRef(false)
  const travelRafRef = useRef<number>(0)
  const lastActivityRef = useRef(now())
  const speechTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const moodTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    boundsRef.current = bounds
    positionsRef.current = positions
    sizesRef.current = sizes
  }, [bounds, positions, sizes])

  const applyPosition = useCallback((x: number, y: number) => {
    const clamped = clampSpideyPosition(x, y, boundsRef.current)
    positionRef.current = clamped
    setPosition(clamped)
  }, [])

  const clientToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const pan = panRef.current ?? { x: 0, y: 0 }
      const zoom = zoomRef.current ?? 1
      return { x: (clientX - pan.x) / zoom, y: (clientY - pan.y) / zoom }
    },
    [panRef, zoomRef]
  )

  const setMood = useCallback((next: SpideyMood) => {
    clearTimeout(moodTimerRef.current)
    setMoodState(next)
  }, [])

  const notifyActivity = useCallback(() => {
    lastActivityRef.current = now()
  }, [])

  const say = useCallback((text: string, durationMs = 4200) => {
    setSpeech({ text, visible: true })
    clearTimeout(speechTimerRef.current)
    speechTimerRef.current = setTimeout(
      () => setSpeech((current) => ({ ...current, visible: false })),
      durationMs
    )
  }, [])

  const cancelTravel = useCallback(() => {
    travelTokenRef.current += 1
    travelingRef.current = false
    if (travelRafRef.current) cancelAnimationFrame(travelRafRef.current)
    clearTimeout(moodTimerRef.current)
    setWeb((current) => (current.visible ? { ...current, visible: false } : current))
    setMoodState((current) => (current === "swing" ? "idle" : current))
  }, [])

  /** Web-swing along a pendulum arc to a target, with a thread to the anchor. */
  const travelTo = useCallback(
    (target: { x: number; y: number }, options?: TravelOptions) => {
      lastActivityRef.current = now()
      const dest = clampSpideyPosition(target.x, target.y, boundsRef.current)
      const start = { ...positionRef.current }
      const distance = Math.hypot(dest.x - start.x, dest.y - start.y)

      if (distance < 12) {
        applyPosition(dest.x, dest.y)
        return
      }

      // Anchor the web above the path so he swings beneath it.
      const swingHeight = Math.min(440, 170 + distance * 0.55)
      const anchor = {
        x: (start.x + dest.x) / 2,
        y: Math.min(start.y, dest.y) - swingHeight,
      }
      const rStart = Math.hypot(start.x - anchor.x, start.y - anchor.y)
      const rEnd = Math.hypot(dest.x - anchor.x, dest.y - anchor.y)
      const angStart = Math.atan2(start.y - anchor.y, start.x - anchor.x)
      const angEnd = Math.atan2(dest.y - anchor.y, dest.x - anchor.x)
      const duration = Math.min(950, Math.max(520, distance * 1.05))

      const token = ++travelTokenRef.current
      travelingRef.current = true
      clearTimeout(moodTimerRef.current)
      setMoodState("swing")
      setWeb({ x: anchor.x, y: anchor.y, visible: true })

      let startTime: number | null = null
      const step = (frameTime: number) => {
        if (token !== travelTokenRef.current) return
        if (startTime === null) startTime = frameTime
        const t = Math.min(1, (frameTime - startTime) / duration)
        const e = easeInOutSine(t)
        const ang = angStart + (angEnd - angStart) * e
        const r = rStart + (rEnd - rStart) * e
        applyPosition(anchor.x + Math.cos(ang) * r, anchor.y + Math.sin(ang) * r)

        if (t < 1) {
          travelRafRef.current = requestAnimationFrame(step)
          return
        }

        applyPosition(dest.x, dest.y)
        travelingRef.current = false
        setWeb((current) => ({ ...current, visible: false }))
        const endMood = options?.endMood ?? "peek"
        setMoodState(endMood)
        if (endMood !== "idle") {
          moodTimerRef.current = setTimeout(() => setMoodState("idle"), 1400)
        }
      }
      travelRafRef.current = requestAnimationFrame(step)
    },
    [applyPosition]
  )

  const beginDrag = useCallback(
    (clientX: number, clientY: number) => {
      cancelTravel()
      lastActivityRef.current = now()
      const canvasPoint = clientToCanvas(clientX, clientY)
      dragOffset.current = {
        x: canvasPoint.x - positionRef.current.x,
        y: canvasPoint.y - positionRef.current.y,
      }
      setDragging(true)
      draggingRef.current = true
    },
    [cancelTravel, clientToCanvas]
  )

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      lastActivityRef.current = now()
      const canvasPoint = clientToCanvas(clientX, clientY)
      applyPosition(
        canvasPoint.x - dragOffset.current.x,
        canvasPoint.y - dragOffset.current.y
      )
    },
    [applyPosition, clientToCanvas]
  )

  const endDrag = useCallback(() => {
    setDragging(false)
    draggingRef.current = false
    lastActivityRef.current = now()
  }, [])

  // Autonomous wandering when the visitor goes quiet.
  useEffect(() => {
    let lastWander = 0
    const timer = window.setInterval(() => {
      const t = now()
      if (draggingRef.current || travelingRef.current) return
      if (t - lastActivityRef.current < IDLE_BEFORE_WANDER_MS) return
      if (t - lastWander < WANDER_INTERVAL_MS) return

      const candidates = CANVAS_ITEMS.filter((item) => WANDER_TYPES.has(item.type))
      if (!candidates.length) return
      const item = candidates[Math.floor(Math.random() * candidates.length)]
      const pos = positionsRef.current[item.id] ?? { x: item.x, y: item.y }
      const size = sizesRef.current[item.id] ?? { w: item.width, h: item.height }

      lastWander = t
      travelTo(
        {
          x: pos.x + size.w / 2 + (Math.random() - 0.5) * 40,
          y: pos.y + size.h / 2 + (Math.random() - 0.5) * 40,
        },
        { wander: true }
      )
      if (Math.random() < 0.5) {
        say(WANDER_QUIPS[Math.floor(Math.random() * WANDER_QUIPS.length)])
      }
    }, 2000)
    return () => window.clearInterval(timer)
  }, [travelTo, say])

  // A one-time welcome nudge shortly after the board settles.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (now() - lastActivityRef.current > 3000) {
        say("hey! press T for a quick tour 🕸️", 5200)
      }
    }, 4200)
    return () => window.clearTimeout(timer)
  }, [say])

  useEffect(() => {
    return () => {
      if (travelRafRef.current) cancelAnimationFrame(travelRafRef.current)
      clearTimeout(speechTimerRef.current)
      clearTimeout(moodTimerRef.current)
    }
  }, [])

  useEffect(() => {
    registerApi?.({
      setPosition: (next) => applyPosition(next.x, next.y),
      travelTo,
      setMood,
      say,
    })
  }, [registerApi, applyPosition, travelTo, setMood, say])

  const value = useMemo(
    () => ({
      position,
      dragging,
      mood,
      web,
      speech,
      beginDrag,
      moveDrag,
      endDrag,
      setMood,
      travelTo,
      say,
      notifyActivity,
    }),
    [
      position,
      dragging,
      mood,
      web,
      speech,
      beginDrag,
      moveDrag,
      endDrag,
      setMood,
      travelTo,
      say,
      notifyActivity,
    ]
  )

  return <SpideyContext.Provider value={value}>{children}</SpideyContext.Provider>
}

export function useSpidey() {
  const context = useContext(SpideyContext)
  if (!context) {
    throw new Error("useSpidey must be used within SpideyProvider")
  }
  return context
}
