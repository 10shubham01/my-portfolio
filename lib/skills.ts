import skillsJson from "@/data/skills.json"

export type SkillCategory = "frontend" | "backend" | "ai" | "tools"

export interface Skill {
  name: string
  slug?: string
  iconUrl?: string
  category?: SkillCategory
  /** Brand icon is near-black; invert it in dark mode so it stays visible. */
  invertDark?: boolean
}

export interface SkillGroup {
  id: SkillCategory
  label: string
  skills: Skill[]
}

const GROUP_ORDER: { id: SkillCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI Tools" },
  { id: "tools", label: "Tools" },
]

export function getSkillGroups(skills: Skill[] = SKILLS): SkillGroup[] {
  return GROUP_ORDER.flatMap(({ id, label }) => {
    const groupSkills = skills.filter((skill) => (skill.category ?? "frontend") === id)
    if (!groupSkills.length) return []
    return [{ id, label, skills: groupSkills }]
  })
}

const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org"

export function getSkillIconUrl(skill: Skill): string {
  if (skill.iconUrl) return skill.iconUrl
  if (skill.slug) return `${SIMPLE_ICONS_CDN}/${skill.slug}`
  return `${SIMPLE_ICONS_CDN}/code`
}

export const SKILLS: Skill[] = skillsJson.skills as Skill[]
