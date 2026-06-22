import canvasItemsJson from "@/data/canvas-items.json"

export type CanvasItemType =
  | "intro"
  | "video"
  | "image"
  | "placeholder"
  | "skills"
  | "work"
  | "awards"
  | "github"
  | "doodle"
  | "socials"
  | "now"
  | "project"
  | "peerlist"
  | "theme"
  | "manifesto"
  | "contact"
  | "tagline"
export type CanvasComponentId =
  | "intro"
  | "media"
  | "skills"
  | "work"
  | "awards"
  | "github"
  | "web-doodle"
  | "socials"
  | "now"
  | "project"
  | "peerlist"
  | "theme-doodle"
  | "manifesto"
  | "contact"
  | "tagline-char"

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
  mediaClassName?: string
  placeholderColor?: string
  thumbnail?: string
  workId?: string
  projectId?: string
  char?: string
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

// "Fullstack Developer" as a single row of individually draggable letters,
// sitting above everything as a banner at the top of the board. Each letter is
// a fixed-position canvas card so it can be picked up and moved on its own.
const TAGLINE_TEXT = "Fullstack Developer"
const TAGLINE_ORIGIN = { x: -600, y: -760 }
const TAGLINE_CHAR_WIDTH = 60
const TAGLINE_CHAR_HEIGHT = 104
const TAGLINE_CHAR_ADVANCE = 64

function generateTaglineItems(): CanvasItemConfig[] {
  const items: CanvasItemConfig[] = []

  TAGLINE_TEXT.split("").forEach((char, index) => {
    if (char === " ") return
    items.push({
      id: `tagline-${index}`,
      component: "tagline-char",
      type: "tagline",
      label: char,
      char,
      scatter: false,
      position: {
        x: TAGLINE_ORIGIN.x + index * TAGLINE_CHAR_ADVANCE,
        y: TAGLINE_ORIGIN.y,
      },
      size: { width: TAGLINE_CHAR_WIDTH, height: TAGLINE_CHAR_HEIGHT },
    })
  })

  return items
}

export function loadCanvasItems(): CanvasItem[] {
  return [
    ...(canvasItemsJson.items as CanvasItemConfig[]),
    ...generateTaglineItems(),
  ].map(normalizeItem)
}

export const CANVAS_ITEMS = loadCanvasItems()
