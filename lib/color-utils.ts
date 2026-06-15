export function hslToHex(h: number, s: number, l: number) {
  const hue = Math.floor(h / 60) % 6
  const fraction = h / 60 - Math.floor(h / 60)
  const chroma = (l / 100) * (1 - s / 100)
  const x = chroma * (1 - fraction)
  const m = (l / 100) * (1 - (1 - fraction) * (s / 100))

  const rgb = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ][hue].map((value) => Math.round(255 * value).toString(16).padStart(2, "0"))

  return `#${rgb.join("")}`
}

export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0

  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }

  const lightness = max
  const saturation = max === 0 ? 0 : delta / max

  return [hue, saturation * 100, lightness * 100]
}
