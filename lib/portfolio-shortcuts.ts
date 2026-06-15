export type ShortcutEntry = {
  keys: string[]
  label: string
  group: "Navigation" | "Canvas" | "View" | "Actions" | "Hidden"
}

export const PORTFOLIO_SHORTCUTS: ShortcutEntry[] = [
  { keys: ["⌘", "K"], label: "Open spotlight", group: "Navigation" },
  { keys: ["?"], label: "Keyboard shortcuts", group: "Navigation" },
  { keys: ["Esc"], label: "Reset view", group: "Navigation" },
  { keys: ["←", "→"], label: "Cycle cards", group: "Navigation" },
  { keys: ["R"], label: "Reset canvas layout", group: "Canvas" },
  { keys: ["D"], label: "Toggle dark mode", group: "Canvas" },
  { keys: ["S"], label: "Summon Spidey to focused card", group: "Hidden" },
  { keys: ["Scroll"], label: "Pan canvas", group: "View" },
  { keys: ["⌘", "Scroll"], label: "Zoom in / out", group: "View" },
  { keys: ["Pinch"], label: "Zoom (touch)", group: "View" },
  { keys: ["Right-click"], label: "Open navigation menu", group: "View" },
]

export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const
