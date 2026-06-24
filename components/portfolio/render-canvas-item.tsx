"use client"

import type { CanvasItem } from "@/lib/canvas-config"
import { IntroCard } from "@/components/portfolio/intro-card"
import { MediaItem } from "@/components/portfolio/media-item"
import { SkillsWidget } from "@/components/portfolio/skills-widget"
import { ExperienceCard } from "@/components/portfolio/experience-card"
import { AwardsCard } from "@/components/portfolio/awards-card"
import { GitHubGraphCard } from "@/components/portfolio/github-graph-card"
import { WebDoodleCard } from "@/components/portfolio/web-doodle-card"
import { SocialsCard } from "@/components/portfolio/socials-card"
import { NowCard } from "@/components/portfolio/now-card"
import { ProjectCard } from "@/components/portfolio/project-card"
import { PeerlistCard } from "@/components/portfolio/peerlist-card"
import { ThemeDoodle } from "@/components/portfolio/theme-doodle"
import { ManifestoCard } from "@/components/portfolio/manifesto-card"
import { ContactCard } from "@/components/portfolio/contact-card"
import { PhoneRcCard } from "@/components/portfolio/phone-rc-card"
import { TaglineChar } from "@/components/portfolio/tagline-char"

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
    case "work":
      return (
        <ExperienceCard
          workId={item.workId ?? frameItem.workId ?? ""}
          interactive={active}
          onResize={onResize}
        />
      )
    case "awards":
      return <AwardsCard interactive={active} onResize={onResize} />
    case "github":
      return <GitHubGraphCard interactive={active} onResize={onResize} />
    case "web-doodle":
      return <WebDoodleCard interactive={active} />
    case "socials":
      return <SocialsCard interactive={active} onResize={onResize} />
    case "now":
      return <NowCard interactive={active} onResize={onResize} />
    case "project":
      return (
        <ProjectCard
          projectId={item.projectId ?? frameItem.projectId ?? ""}
          interactive={active}
          onResize={onResize}
        />
      )
    case "peerlist":
      return <PeerlistCard interactive={active} onResize={onResize} />
    case "theme-doodle":
      return <ThemeDoodle />
    case "manifesto":
      return <ManifestoCard interactive={active} onResize={onResize} />
    case "contact":
      return <ContactCard interactive={active} onResize={onResize} />
    case "phone-rc":
      return <PhoneRcCard interactive={active} onResize={onResize} />
    case "tagline-char":
      return <TaglineChar char={item.char ?? frameItem.char ?? ""} />
    default:
      return null
  }
}
