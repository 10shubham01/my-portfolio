import { CANVAS_ITEMS } from "@/lib/canvas-config"

const PARAM = "to"
const VIEW_PARAM = "view"

export type CanvasView = { x: number; y: number; zoom: number }

/**
 * Encodes an arbitrary camera (pan + zoom) as a compact `x_y_zoom` string so a
 * visitor can share the exact region of the board they are looking at, not just
 * a focused card.
 */
export function encodeView({ x, y, zoom }: CanvasView): string {
  return `${Math.round(x)}_${Math.round(y)}_${zoom.toFixed(3)}`
}

export function decodeView(raw: string | null | undefined): CanvasView | null {
  if (!raw) return null
  const parts = raw.split("_")
  if (parts.length !== 3) return null
  const x = Number(parts[0])
  const y = Number(parts[1])
  const zoom = Number(parts[2])
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(zoom)) return null
  if (zoom <= 0) return null
  return { x, y, zoom }
}

export function getViewFromUrl(search = ""): CanvasView | null {
  return decodeView(new URLSearchParams(search).get(VIEW_PARAM))
}

export function buildViewDeeplink(view: CanvasView, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "")
  const url = new URL(base || "http://localhost")
  url.searchParams.delete(PARAM)
  url.searchParams.set(VIEW_PARAM, encodeView(view))
  return url.toString()
}

export async function copyViewDeeplink(view: CanvasView): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildViewDeeplink(view))
    return true
  } catch {
    return false
  }
}

export function isValidCanvasItemId(id: string): boolean {
  return CANVAS_ITEMS.some((item) => item.id === id)
}

export function getItemIdFromUrl(search = ""): string | null {
  const id = new URLSearchParams(search).get(PARAM)
  return id && isValidCanvasItemId(id) ? id : null
}

export function buildItemDeeplink(id: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "")
  const url = new URL(base || "http://localhost")
  url.searchParams.set(PARAM, id)
  return url.toString()
}

export function setItemDeeplink(id: string | null, replace = true) {
  if (typeof window === "undefined") return

  const url = new URL(window.location.href)
  // Focusing a card supersedes any shared raw-camera view.
  url.searchParams.delete(VIEW_PARAM)
  if (id && isValidCanvasItemId(id)) {
    url.searchParams.set(PARAM, id)
  } else {
    url.searchParams.delete(PARAM)
  }

  const next = `${url.pathname}${url.search}${url.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next === current) return

  const state = { canvasItem: id }
  if (replace) {
    window.history.replaceState(state, "", next)
  } else {
    window.history.pushState(state, "", next)
  }
}

export async function copyItemDeeplink(id: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildItemDeeplink(id))
    return true
  } catch {
    return false
  }
}
