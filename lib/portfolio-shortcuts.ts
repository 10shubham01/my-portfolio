export type ShortcutEntry = {
  keys: string[]
  label: string
  group: "Navigation" | "Canvas" | "View" | "Actions" | "Hidden"
}

export const PORTFOLIO_SHORTCUTS: ShortcutEntry[] = [
  { keys: ["⌘", "K"], label: "Open spotlight", group: "Navigation" },
  { keys: ["?"], label: "Keyboard shortcuts", group: "Navigation" },
  { keys: ["T"], label: "Take the guided tour", group: "Navigation" },
  { keys: ["Esc"], label: "Reset view", group: "Navigation" },
  { keys: ["←", "→"], label: "Cycle cards", group: "Navigation" },
  { keys: ["R"], label: "Reset canvas layout", group: "Canvas" },
  { keys: ["D"], label: "Toggle dark mode", group: "Canvas" },
  { keys: ["⌥", "←↑↓→"], label: "Nudge selected card (⇧ for 10px)", group: "Canvas" },
  { keys: ["⌘", "Z"], label: "Undo card move (⇧ to redo)", group: "Canvas" },
  { keys: ["⌥", "Hover"], label: "Measure distance from selection", group: "Canvas" },
  { keys: ["S"], label: "Summon Spidey to focused card", group: "Hidden" },
  { keys: ["Scroll"], label: "Pan canvas", group: "View" },
  { keys: ["⌘", "Scroll"], label: "Zoom in / out", group: "View" },
  { keys: ["Pinch"], label: "Zoom (touch)", group: "View" },
  { keys: ["⇧", "1"], label: "Zoom to fit", group: "View" },
  { keys: ["⇧", "2"], label: "Zoom to selection", group: "View" },
  { keys: ["⌘", "0"], label: "Zoom to 100%", group: "View" },
  { keys: ["Right-click"], label: "Card actions / navigation menu", group: "View" },
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
