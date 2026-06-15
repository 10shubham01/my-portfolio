export type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "portfolio-theme"

export const LIGHT_CANVAS_BG = "#f5f5f5"
export const DARK_CANVAS_BG = "#1a1a1a"

export function getCanvasBg(theme: Theme) {
  return theme === "dark" ? DARK_CANVAS_BG : LIGHT_CANVAS_BG
}

export function getDotColor(bgHex: string) {
  const normalized = bgHex.replace("#", "")
  if (normalized.length !== 6) return "rgba(0, 0, 0, 0.12)"

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.1)"
}

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "light" || stored === "dark") return stored

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}
