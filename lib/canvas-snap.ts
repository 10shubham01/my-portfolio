export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface SnapGuide {
  axis: "v" | "h"
  position: number
  start: number
  end: number
}

export interface SnapResult {
  x: number
  y: number
  guides: SnapGuide[]
}

const GUIDE_OVERHANG = 8

function edges(rect: Rect, axis: "x" | "y") {
  return axis === "x"
    ? [rect.x, rect.x + rect.w / 2, rect.x + rect.w]
    : [rect.y, rect.y + rect.h / 2, rect.y + rect.h]
}

// Figma-style edge/center snapping: given the rect being dragged and the
// static rects around it, returns the snapped position plus the guide lines
// to draw. Threshold is in world px (divide the on-screen tolerance by zoom).
export function computeSnap(
  moving: Rect,
  others: Rect[],
  threshold: number
): SnapResult {
  let bestX: { delta: number; other: Rect } | null = null
  let bestY: { delta: number; other: Rect } | null = null

  for (const other of others) {
    for (const own of edges(moving, "x")) {
      for (const target of edges(other, "x")) {
        const delta = target - own
        if (Math.abs(delta) <= threshold && (!bestX || Math.abs(delta) < Math.abs(bestX.delta))) {
          bestX = { delta, other }
        }
      }
    }
    for (const own of edges(moving, "y")) {
      for (const target of edges(other, "y")) {
        const delta = target - own
        if (Math.abs(delta) <= threshold && (!bestY || Math.abs(delta) < Math.abs(bestY.delta))) {
          bestY = { delta, other }
        }
      }
    }
  }

  const x = moving.x + (bestX?.delta ?? 0)
  const y = moving.y + (bestY?.delta ?? 0)
  const snapped: Rect = { ...moving, x, y }
  const guides: SnapGuide[] = []

  // Float tolerance: snapped edges land within an ulp of the target, so
  // exact equality would silently drop guides.
  const aligned = (edgeList: number[], value: number) =>
    edgeList.some((edge) => Math.abs(edge - value) < 0.01)

  if (bestX) {
    // Every aligned x-edge gets a guide, not just the winning one, so a card
    // centered on another shows both edge lines when widths match.
    const targets = edges(bestX.other, "x")
    for (const own of edges(snapped, "x")) {
      if (!aligned(targets, own)) continue
      guides.push({
        axis: "v",
        position: own,
        start: Math.min(snapped.y, bestX.other.y) - GUIDE_OVERHANG,
        end: Math.max(snapped.y + snapped.h, bestX.other.y + bestX.other.h) + GUIDE_OVERHANG,
      })
    }
  }

  if (bestY) {
    const targets = edges(bestY.other, "y")
    for (const own of edges(snapped, "y")) {
      if (!aligned(targets, own)) continue
      guides.push({
        axis: "h",
        position: own,
        start: Math.min(snapped.x, bestY.other.x) - GUIDE_OVERHANG,
        end: Math.max(snapped.x + snapped.w, bestY.other.x + bestY.other.w) + GUIDE_OVERHANG,
      })
    }
  }

  return { x, y, guides }
}

export interface MeasureLine {
  axis: "v" | "h"
  from: { x: number; y: number }
  to: { x: number; y: number }
  label: number
}

// Distances between two rects for the Alt+hover inspector: one line per axis
// where the rects don't overlap, drawn between the closest edges at the
// midpoint of the shared span (or between centers when there is no overlap).
export function computeMeasureLines(a: Rect, b: Rect): MeasureLine[] {
  const lines: MeasureLine[] = []

  const gapRight = b.x - (a.x + a.w)
  const gapLeft = a.x - (b.x + b.w)
  const overlapTop = Math.max(a.y, b.y)
  const overlapBottom = Math.min(a.y + a.h, b.y + b.h)
  const midY =
    overlapBottom > overlapTop
      ? (overlapTop + overlapBottom) / 2
      : (a.y + a.h / 2 + b.y + b.h / 2) / 2

  if (gapRight > 0) {
    lines.push({
      axis: "h",
      from: { x: a.x + a.w, y: midY },
      to: { x: b.x, y: midY },
      label: Math.round(gapRight),
    })
  } else if (gapLeft > 0) {
    lines.push({
      axis: "h",
      from: { x: b.x + b.w, y: midY },
      to: { x: a.x, y: midY },
      label: Math.round(gapLeft),
    })
  }

  const gapBelow = b.y - (a.y + a.h)
  const gapAbove = a.y - (b.y + b.h)
  const overlapLeft = Math.max(a.x, b.x)
  const overlapRight = Math.min(a.x + a.w, b.x + b.w)
  const midX =
    overlapRight > overlapLeft
      ? (overlapLeft + overlapRight) / 2
      : (a.x + a.w / 2 + b.x + b.w / 2) / 2

  if (gapBelow > 0) {
    lines.push({
      axis: "v",
      from: { x: midX, y: a.y + a.h },
      to: { x: midX, y: b.y },
      label: Math.round(gapBelow),
    })
  } else if (gapAbove > 0) {
    lines.push({
      axis: "v",
      from: { x: midX, y: b.y + b.h },
      to: { x: midX, y: a.y },
      label: Math.round(gapAbove),
    })
  }

  return lines
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  )
}
