export const SPIDEY_FRAME_LABEL = 24
export const SPIDEY_VIEW_SIZE = 200
export const SPIDEY_LOCAL_X = 100
export const SPIDEY_LOCAL_Y = 100

export const SPIDEY_FIGURE_VIEWBOX = {
  x: 60,
  y: 64,
  width: 74,
  height: 78,
} as const

export const SPIDEY_RENDER_HEIGHT = 132
export const SPIDEY_RENDER_WIDTH = Math.round(
  SPIDEY_RENDER_HEIGHT * (SPIDEY_FIGURE_VIEWBOX.width / SPIDEY_FIGURE_VIEWBOX.height)
)
export const SPIDEY_HIT_RADIUS = Math.ceil(
  Math.max(SPIDEY_RENDER_WIDTH, SPIDEY_RENDER_HEIGHT) / 2
)

export function getSpideyHomePosition(
  frameX: number,
  frameY: number,
  frameWidth: number
) {
  const scale = frameWidth / SPIDEY_VIEW_SIZE

  return {
    x: frameX + SPIDEY_LOCAL_X * scale,
    y: frameY + SPIDEY_FRAME_LABEL + SPIDEY_LOCAL_Y * scale,
  }
}

export function clampSpideyPosition(
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
) {
  const margin = SPIDEY_HIT_RADIUS

  return {
    x: Math.min(Math.max(x, bounds.minX + margin), bounds.maxX - margin),
    y: Math.min(Math.max(y, bounds.minY + margin), bounds.maxY - margin),
  }
}
