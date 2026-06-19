import projectsJson from "@/data/projects.json"

export interface ProjectEntry {
  id: string
  name: string
  tagline: string
  description: string
  highlights: string[]
  stack: string[]
  href: string
  media?: string
  mediaAlt?: string
  mediaAspect?: string
}

export const PROJECTS: ProjectEntry[] = projectsJson.projects

export function getProjectById(id: string) {
  return PROJECTS.find((entry) => entry.id === id)
}
