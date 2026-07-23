import { CANVAS_ITEMS, type CanvasComponentId } from "@/lib/canvas-config"
import { SITE } from "@/lib/canvas-data"
import { getExperienceById } from "@/lib/experience"
import { getProjectById } from "@/lib/projects"

// Cards worth surfacing in search results — each of these has its own
// title/description via getCanvasItemMeta. Purely decorative items (media,
// doodles, the theme toggle, tagline letters) and the intro card (covered by
// the site root) are intentionally excluded.
const INDEXABLE_COMPONENTS: CanvasComponentId[] = [
  "project",
  "work",
  "skills",
  "awards",
  "github",
  "socials",
  "now",
  "contact",
  "webcam",
  "resume-card",
  "manifesto",
  "peerlist",
  "mcp",
]

export function getIndexableCanvasItemIds(): string[] {
  return CANVAS_ITEMS.filter((item) =>
    INDEXABLE_COMPONENTS.includes(item.component)
  ).map((item) => item.id)
}

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
    case "webcam":
      return {
        title: withName("Live Pixel Cam — motion-reactive webcam grid"),
        description: `An interactive toy by ${SITE.name}: a 3D pixel grid driven by your webcam, processed entirely on-device. Camera turns on only when you select the card.`,
      }
    case "resume-card":
      return {
        title: withName("Resume"),
        description: `Download ${SITE.name}'s resume — experience, skills, and selected work as a one-page PDF.`,
      }
    case "manifesto":
      return {
        title: withName("Principles"),
        description: `The principles ${SITE.name} builds by — on systems, details, product, motion, and restraint.`,
      }
    case "mcp":
      return {
        title: withName("MCP server — connect your AI"),
        description: `${SITE.name}'s portfolio doubles as an MCP server: connect Claude, Cursor, or any MCP client to ${SITE.url}/api/mcp and query his work, projects, and skills — or send him a message.`,
      }
    case "peerlist":
      return {
        title: withName("Featured on Peerlist"),
        description: `${SITE.name}'s portfolio, featured as a Project of the Week on Peerlist.`,
      }
    case "intro":
      return DEFAULT_META
  }

  return DEFAULT_META
}
