import skillsJson from "@/data/skills.json"

export interface Skill {
  name: string
  slug?: string
  iconUrl?: string
}

const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org"

export function getSkillIconUrl(skill: Skill): string {
  if (skill.iconUrl) return skill.iconUrl
  if (skill.slug) return `${SIMPLE_ICONS_CDN}/${skill.slug}`
  return `${SIMPLE_ICONS_CDN}/code`
}

export const SKILLS: Skill[] = skillsJson.skills
