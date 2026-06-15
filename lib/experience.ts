import experienceJson from "@/data/experience.json"

export interface WorkProject {
  title: string
  description: string
  stack?: string[]
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  period: string
  highlights: string[]
  stack: string[]
  projects?: WorkProject[]
  href?: string
}

export const EXPERIENCE: ExperienceEntry[] = experienceJson.experience

export function getExperienceById(id: string) {
  return EXPERIENCE.find((entry) => entry.id === id)
}
