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

export type SpideyMood = "idle" | "excited" | "dance" | "peek"

type SpideyApi = {
  setPosition: (position: { x: number; y: number }) => void
  setMood: (mood: SpideyMood) => void
}

type SpideyContextValue = {
  position: { x: number; y: number }
  dragging: boolean
  mood: SpideyMood
  beginDrag: (clientX: number, clientY: number) => void
  moveDrag: (clientX: number, clientY: number) => void
  endDrag: () => void
  setMood: (mood: SpideyMood) => void
  jumpTo: (position: { x: number; y: number }) => void
}

const SpideyContext = createContext<SpideyContextValue | null>(null)

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
  const dragOffset = useRef({ x: 0, y: 0 })
  const positionRef = useRef(position)
  const boundsRef = useRef(bounds)

  positionRef.current = position
  boundsRef.current = bounds

  const clientToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const pan = panRef.current ?? { x: 0, y: 0 }
      const zoom = zoomRef.current ?? 1

      return {
        x: (clientX - pan.x) / zoom,
        y: (clientY - pan.y) / zoom,
      }
    },
    [panRef, zoomRef]
  )

  const setCanvasPosition = useCallback((x: number, y: number) => {
    setPosition(clampSpideyPosition(x, y, boundsRef.current))
  }, [])

  const beginDrag = useCallback(
    (clientX: number, clientY: number) => {
      const canvasPoint = clientToCanvas(clientX, clientY)
      dragOffset.current = {
        x: canvasPoint.x - positionRef.current.x,
        y: canvasPoint.y - positionRef.current.y,
      }
      setDragging(true)
    },
    [clientToCanvas]
  )

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      const canvasPoint = clientToCanvas(clientX, clientY)
      setCanvasPosition(
        canvasPoint.x - dragOffset.current.x,
        canvasPoint.y - dragOffset.current.y
      )
    },
    [clientToCanvas, setCanvasPosition]
  )

  const endDrag = useCallback(() => {
    setDragging(false)
  }, [])

  const setMood = useCallback((next: SpideyMood) => {
    setMoodState(next)
  }, [])

  const jumpTo = useCallback((target: { x: number; y: number }) => {
    setCanvasPosition(target.x, target.y)
    setMoodState("peek")
  }, [setCanvasPosition])

  useEffect(() => {
    registerApi?.({
      setPosition: (next) => setPosition(clampSpideyPosition(next.x, next.y, boundsRef.current)),
      setMood,
    })
  }, [registerApi, setMood])

  const value = useMemo(
    () => ({
      position,
      dragging,
      mood,
      beginDrag,
      moveDrag,
      endDrag,
      setMood,
      jumpTo,
    }),
    [position, dragging, mood, beginDrag, moveDrag, endDrag, setMood, jumpTo]
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
