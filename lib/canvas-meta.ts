import { CANVAS_ITEMS } from "@/lib/canvas-config"
import { SITE } from "@/lib/canvas-data"
import { getExperienceById } from "@/lib/experience"
import { getProjectById } from "@/lib/projects"

export interface CanvasItemMeta {
  title: string
  description: string
}

export const DEFAULT_META: CanvasItemMeta = {
  title: `${SITE.name} — ${SITE.title} @ ${SITE.company}`,
  description: `${SITE.name} — ${SITE.title.toLowerCase()} at ${SITE.company} in ${SITE.location}, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development.`,
}

const withName = (label: string) => `${label} · ${SITE.name}`

export function getCanvasItemMeta(id: string | null | undefined): CanvasItemMeta {
  if (!id) return DEFAULT_META

  const item = CANVAS_ITEMS.find((entry) => entry.id === id)
  if (!item) return DEFAULT_META

  switch (item.component) {
    case "project": {
      const project = getProjectById(item.projectId ?? "")
      if (project) {
        return {
          title: withName(`${project.name} — ${project.tagline}`),
          description: project.description,
        }
      }
      break
    }
    case "work": {
      const entry = getExperienceById(item.workId ?? "")
      if (entry) {
        return {
          title: withName(`${entry.role} @ ${entry.company}`),
          description: `${entry.role} at ${entry.company} (${entry.period}). ${entry.highlights[0] ?? ""}`.trim(),
        }
      }
      break
    }
    case "skills":
      return {
        title: withName("Skills & tooling"),
        description: `The stack and tools ${SITE.name} builds with day to day.`,
      }
    case "awards":
      return {
        title: withName("Awards & recognition"),
        description: `Awards and recognition ${SITE.name} has earned along the way.`,
      }
    case "github":
      return {
        title: withName("GitHub activity"),
        description: `${SITE.name}'s open-source contributions and GitHub activity.`,
      }
    case "socials":
      return {
        title: withName("Find me online"),
        description: `Where to find ${SITE.name} across the web.`,
      }
    case "now":
      return {
        title: withName("Right now"),
        description: `What ${SITE.name} is up to right now.`,
      }
    case "contact":
      return {
        title: withName("Get in touch"),
        description: `Send ${SITE.name} a message — ideas, roles, or just to say hi.`,
      }
    case "intro":
      return DEFAULT_META
  }

  return DEFAULT_META
}
