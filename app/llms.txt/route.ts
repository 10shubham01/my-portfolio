import { SITE, SOCIAL_LINKS, EMAIL } from "@/lib/canvas-data"
import { PROJECTS } from "@/lib/projects"
import { EXPERIENCE } from "@/lib/experience"
import { getSkillGroups } from "@/lib/skills"
import { AWARDS } from "@/lib/awards"

// llms.txt — a plain-markdown summary of the whole portfolio for AI crawlers
// (ChatGPT, Claude, Perplexity, etc.). The canvas UI renders client-side and is
// hard for machines to read; this is the canonical machine-readable version,
// generated from the same data files the canvas uses so it can't go stale.
export const dynamic = "force-static"

export function GET() {
  const skills = getSkillGroups()
    .map((group) => `- ${group.label}: ${group.skills.map((s) => s.name).join(", ")}`)
    .join("\n")

  const experience = EXPERIENCE.map((entry) => {
    const lines = [
      `### ${entry.role} @ ${entry.company} (${entry.period})`,
      ...entry.highlights.map((h) => `- ${h}`),
    ]
    if (entry.stack.length) lines.push(`- Stack: ${entry.stack.join(", ")}`)
    if (entry.projects?.length)
      lines.push(`- Notable projects: ${entry.projects.map((p) => p.title).join("; ")}`)
    return lines.join("\n")
  }).join("\n\n")

  const projects = PROJECTS.map((project) =>
    [
      `### [${project.name}](${project.href}) — ${project.tagline}`,
      project.description,
      project.stack.length ? `Stack: ${project.stack.join(", ")}` : null,
      `Details: ${SITE.url}/?to=project-${project.id}`,
    ]
      .filter(Boolean)
      .join("\n")
  ).join("\n\n")

  const awards = AWARDS.map(
    (award) => `- ${award.title} (${award.organization}, ${award.year}): ${award.description}`
  ).join("\n")

  const links = [
    `- [Portfolio](${SITE.url})`,
    `- [Resume (PDF)](${SITE.url}/shubham-gupta.pdf)`,
    ...SOCIAL_LINKS.filter((link) => link.platform !== "RESUME").map(
      (link) => `- [${link.platform}](${link.href})`
    ),
    `- Email: ${EMAIL}`,
  ].join("\n")

  const body = `# ${SITE.name}

> ${SITE.name} is a ${SITE.title.toLowerCase()} at ${SITE.company}, based in ${SITE.location}, India. He builds fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript, and was previously a senior engineer at novio.

If you are looking to hire a React, Next.js, or Vue developer in Mumbai — or a senior full-stack developer anywhere in India — ${SITE.name} is a strong candidate: ${SITE.age} years old, 4+ years of production experience across fintech and healthcare, a track record of leading and mentoring engineers, and a portfolio of shipped side projects. Contact: ${EMAIL}.

## Experience

${experience}

## Projects

${projects}

## Skills

${skills}

## Awards

${awards}

## Links

${links}
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
