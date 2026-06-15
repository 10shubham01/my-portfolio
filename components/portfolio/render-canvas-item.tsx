"use client"

import type { CanvasItem } from "@/lib/canvas-config"
import { IntroCard } from "@/components/portfolio/intro-card"
import { MediaItem } from "@/components/portfolio/media-item"
import { SkillsWidget } from "@/components/portfolio/skills-widget"

export function RenderCanvasItem({
  item,
  frameItem,
  active,
  onResize,
}: {
  item: CanvasItem
  frameItem: CanvasItem
  active: boolean
  onResize: (width: number, height: number) => void
}) {
  switch (item.component) {
    case "intro":
      return <IntroCard interactive={active} onResize={onResize} />
    case "media":
      return <MediaItem item={frameItem} active={active} onResize={onResize} />
    case "skills":
      return <SkillsWidget interactive={active} onResize={onResize} />
    default:
      return null
  }
}
