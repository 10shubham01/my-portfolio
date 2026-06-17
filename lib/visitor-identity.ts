/**
 * A lightweight, anonymous identity for a visitor: a stable id, a playful
 * Spidey-themed display name, and an accent color. Persisted in sessionStorage
 * so cursors from the same tab stay consistent, but reset
 * between sessions (no tracking, no PII).
 */

export type VisitorIdentity = {
  id: string
  name: string
  color: string
}

const STORAGE_KEY = "portfolio-visitor-identity"

const NAMES = [
  "Spider-Gwen",
  "Miles",
  "Peter B.",
  "Noir",
  "Peni",
  "Ham",
  "Silk",
  "Scarlet",
  "Kid Arachnid",
  "Spider-Punk",
  "Madame Web",
  "Web-Slinger",
]

const COLORS = [
  "#e23636", // spidey red
  "#3080ff", // spidey blue
  "#18A0FB",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
]

function pick<T>(list: T[], seed: number): T {
  return list[seed % list.length]
}

export function getVisitorIdentity(): VisitorIdentity {
  if (typeof window === "undefined") {
    return { id: "ssr", name: "Visitor", color: COLORS[0] }
  }

  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as VisitorIdentity
    } catch {
      // fall through and regenerate
    }
  }

  const rand = Math.floor(Math.random() * 1_000_000)
  const identity: VisitorIdentity = {
    id: `${Date.now().toString(36)}-${rand.toString(36)}`,
    name: pick(NAMES, rand),
    color: pick(COLORS, Math.floor(rand / NAMES.length)),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
  return identity
}
