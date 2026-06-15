import { CANVAS_ITEMS } from "@/lib/canvas-config"

const PARAM = "to"

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
