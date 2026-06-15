import { CANVAS_ITEMS } from "@/lib/canvas-config"
import type { CanvasItem } from "@/lib/canvas-config"

export type Position = { x: number; y: number }
export type Size = { w: number; h: number }

function createSeededRandom(seed: number) {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), 1 | t)
    return (((t ^ (t + Math.imul(t ^ (t >>> 7), 61 | t))) ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

function placeFixedItems(items: CanvasItem[]) {
  const placed: Record<string, { x: number; y: number; w: number; h: number }> = {}

  for (const item of items) {
    if (!item.scatter) {
      placed[item.id] = { x: item.x, y: item.y, w: item.width, h: item.height }
    }
  }

  return placed
}

export function generateScatterLayout(): Record<string, Position> {
  const random = createSeededRandom(42)
  const placed = placeFixedItems(CANVAS_ITEMS)

  const overlaps = (x: number, y: number, w: number, h: number) =>
    Object.values(placed).some(
      (item) =>
        !(
          x + w + 60 < item.x ||
          x - 60 > item.x + item.w ||
          y + h + 60 < item.y ||
          y - 60 > item.y + item.h
        )
    )

  const scatterItems = CANVAS_ITEMS.filter((item) => item.scatter).sort(
    (a, b) => random() - 0.5 || a.id.localeCompare(b.id)
  )

  for (const item of scatterItems) {
    const angle = random() * Math.PI * 2
    const radius = 900 + 300 * random()
    let x = Math.cos(angle) * radius - item.width / 2
    let y = Math.sin(angle) * radius - item.height / 2

    if (!overlaps(x, y, item.width, item.height)) {
      placed[item.id] = { x, y, w: item.width, h: item.height }
      continue
    }

    let spiral = 0
    let distance = 0
    for (let attempt = 0; attempt < 600; attempt++) {
      distance += 50
      spiral += 0.6
      x = Math.cos(angle) * radius - item.width / 2 + Math.cos(spiral) * distance
      y = Math.sin(angle) * radius - item.height / 2 + Math.sin(spiral) * distance
      if (!overlaps(x, y, item.width, item.height)) break
    }

    placed[item.id] = { x, y, w: item.width, h: item.height }
  }

  return Object.fromEntries(
    Object.entries(placed).map(([id, item]) => [id, { x: item.x, y: item.y }])
  )
}

export function getDefaultSizes(): Record<string, Size> {
  return Object.fromEntries(
    CANVAS_ITEMS.map((item) => [item.id, { w: item.width, h: item.height }])
  )
}

export function getContentBounds(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
) {
  return {
    minX: Math.min(...CANVAS_ITEMS.map((item) => positions[item.id]?.x ?? item.x)),
    maxX: Math.max(
      ...CANVAS_ITEMS.map(
        (item) => (positions[item.id]?.x ?? item.x) + (sizes[item.id]?.w ?? item.width)
      )
    ),
    minY: Math.min(...CANVAS_ITEMS.map((item) => positions[item.id]?.y ?? item.y)),
    maxY: Math.max(
      ...CANVAS_ITEMS.map(
        (item) => (positions[item.id]?.y ?? item.y) + (sizes[item.id]?.h ?? item.height)
      )
    ),
  }
}
