import { CANVAS_ITEMS, type CanvasItem } from "@/lib/canvas-config"

export type NavItem = {
  id: string
  label: string
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

type NavGroupId = "about" | "experience" | "projects" | "connect" | "media"

const GROUPS: { id: NavGroupId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
  { id: "media", label: "Media" },
]

function getNavGroup(item: CanvasItem): NavGroupId | null {
  if (item.type === "theme") return null
  if (item.type === "work") return "experience"
  if (item.type === "project") return "projects"
  if (item.type === "github" || item.type === "socials") return "connect"
  if (item.id === "me") return "about"
  if (item.type === "image" || item.type === "video" || item.type === "doodle") return "media"
  return "about"
}

export function getThemeNavItem(items: CanvasItem[] = CANVAS_ITEMS): NavItem | null {
  const theme = items.find((item) => item.type === "theme")
  if (!theme) return null
  return { id: theme.id, label: theme.label }
}

export function buildCanvasNavGroups(items: CanvasItem[] = CANVAS_ITEMS): NavGroup[] {
  const grouped = new Map<NavGroupId, NavItem[]>()

  for (const item of items) {
    const groupId = getNavGroup(item)
    if (!groupId) continue
    const groupItems = grouped.get(groupId) ?? []
    groupItems.push({ id: item.id, label: item.label })
    grouped.set(groupId, groupItems)
  }

  return GROUPS.flatMap(({ id, label }) => {
    const groupItems = grouped.get(id)
    if (!groupItems?.length) return []
    return [{ id, label, items: groupItems }]
  })
}
