import canvasItemsJson from "@/data/canvas-items.json"

export type CanvasItemType = "intro" | "video" | "image" | "placeholder" | "skills"
export type CanvasComponentId = "intro" | "media" | "skills"

export interface CanvasItemConfig {
  id: string
  component: CanvasComponentId
  type: CanvasItemType
  label: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  scatter?: boolean
  asset?: string
  alt?: string
  placeholderColor?: string
  thumbnail?: string
}

export interface CanvasItem extends CanvasItemConfig {
  x: number
  y: number
  width: number
  height: number
  scatter: boolean
  src?: string
}

function resolveAsset(path: string) {
  return path.startsWith("/") ? path : `/assets/${path}`
}

function normalizeItem(config: CanvasItemConfig): CanvasItem {
  const scatter = config.scatter ?? config.type !== "intro"

  return {
    ...config,
    x: config.position.x,
    y: config.position.y,
    width: config.size.width,
    height: config.size.height,
    scatter,
    src: config.asset ? resolveAsset(config.asset) : undefined,
  }
}

export function loadCanvasItems(): CanvasItem[] {
  return (canvasItemsJson.items as CanvasItemConfig[]).map(normalizeItem)
}

export const CANVAS_ITEMS = loadCanvasItems()
