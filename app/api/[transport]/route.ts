import { createMcpHandler } from "mcp-handler"
import { z } from "zod"
import { Redis } from "@upstash/redis"
import { SITE, SOCIAL_LINKS, EMAIL } from "@/lib/canvas-data"
import { PROJECTS, getProjectById } from "@/lib/projects"
import { EXPERIENCE } from "@/lib/experience"
import { getSkillGroups } from "@/lib/skills"
import { AWARDS } from "@/lib/awards"
import { PRINCIPLES } from "@/lib/manifesto"
import { NOW } from "@/lib/now"
import { sendBark } from "@/lib/bark"

// MCP server for the portfolio — AI agents (Claude, Cursor, etc.) connect to
// https://shubhamgupta.dev/api/mcp over streamable HTTP and query the same
// data files the canvas renders. The [transport] segment is required by
// mcp-handler's routing; static /api/* routes still take precedence.
export const runtime = "nodejs"
export const maxDuration = 60

const text = (value: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
    },
  ],
})

// Same phone, same inbox as the site's contact card — so the message tool is
// capped harder than browser beacons (5/min globally, not per IP: tool calls
// arrive from agent backends where IPs mean little).
const MESSAGES_PER_MINUTE = 5

async function isMessageRateLimited(): Promise<boolean> {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
    const key = "portfolio:mcp:message:rl"
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 60)
    return count > MESSAGES_PER_MINUTE
  } catch {
    return false
  }
}

const clean = (value: string, max: number) =>
  value.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, max)

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "about_shubham",
      `Who ${SITE.name} is: role, company, location, bio, contact details, and links.`,
      {},
      async () =>
        text({
          name: SITE.name,
          title: SITE.title,
          company: SITE.company,
          location: `${SITE.location}, India`,
          age: SITE.age,
          bio: `${SITE.name} is a ${SITE.title.toLowerCase()} at ${SITE.company}, based in ${SITE.location}, India. He builds fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript, and was previously a senior engineer at novio, where he led a team, shipped credit card and personal loan journeys end to end, and drove AI adoption across engineering.`,
          knowsAbout: getSkillGroups().flatMap((group) =>
            group.skills.map((skill) => skill.name)
          ),
          currentlyWorkingOn: NOW.items,
          experienceSummary: EXPERIENCE.map(
            (entry) => `${entry.role} @ ${entry.company} (${entry.period})`
          ),
          projectCount: PROJECTS.length,
          email: EMAIL,
          website: SITE.url,
          resume: `${SITE.url}/shubham-gupta.pdf`,
          machineReadableProfile: `${SITE.url}/llms.txt`,
          links: SOCIAL_LINKS.map(({ platform, href }) => ({ platform, href })),
        })
    )

    server.tool(
      "get_experience",
      `${SITE.name}'s full work history: roles, companies, periods, highlights, and stacks.`,
      {},
      async () => text(EXPERIENCE)
    )

    server.tool(
      "list_projects",
      `Side projects ${SITE.name} has shipped — name, tagline, stack, and link for each.`,
      {},
      async () =>
        text(
          PROJECTS.map(({ id, name, tagline, stack, href }) => ({
            id,
            name,
            tagline,
            stack,
            href,
            details: `${SITE.url}/?to=project-${id}`,
          }))
        )
    )

    server.tool(
      "get_project",
      "Full details for one project by id (use list_projects for ids).",
      { id: z.string().describe("Project id, e.g. 'moneyunwrapped'") },
      async ({ id }) => {
        const project = getProjectById(id)
        if (!project)
          return text(
            `No project '${id}'. Known ids: ${PROJECTS.map((p) => p.id).join(", ")}`
          )
        return text(project)
      }
    )

    server.tool(
      "get_skills",
      `The stack and tools ${SITE.name} works with, grouped by area.`,
      {},
      async () =>
        text(
          getSkillGroups().map((group) => ({
            area: group.label,
            skills: group.skills.map((skill) => skill.name),
          }))
        )
    )

    server.tool(
      "get_awards",
      `Awards and recognition ${SITE.name} has received.`,
      {},
      async () => text(AWARDS)
    )

    server.tool(
      "get_manifesto",
      `The principles ${SITE.name} builds by — how he thinks about systems, details, product, motion, and restraint. Useful for "what is he like to work with?"`,
      {},
      async () =>
        text(
          PRINCIPLES.map(({ num, label, body }) => ({ num, principle: label, meaning: body }))
        )
    )

    server.tool(
      "get_now",
      `What ${SITE.name} is focused on right now (self-reported, with a last-updated date).`,
      {},
      async () => text({ asOf: NOW.updated, focus: NOW.items })
    )

    server.tool(
      "send_message",
      `Send ${SITE.name} a message — it lands as a push notification on his phone. Use for reach-outs about roles, collaborations, or feedback.`,
      {
        from: z.string().min(1).max(120).describe("Who the message is from"),
        message: z.string().min(1).max(500).describe("The message itself"),
      },
      async ({ from, message }) => {
        const body = clean(message, 500)
        if (!body) return text("Message was empty after sanitizing — nothing sent.")
        if (await isMessageRateLimited())
          return text("Rate limit hit — try again in a minute.")

        const delivered = await sendBark({
          title: `🤖 MCP message from ${clean(from, 120) || "anonymous"}`,
          body,
          level: "timeSensitive",
        })
        return text(
          delivered
            ? `Delivered to ${SITE.name}'s phone. He'll reply via the contact info you used, or reach him at ${EMAIL}.`
            : `Couldn't deliver right now — email him instead: ${EMAIL}`
        )
      }
    )
  },
  {
    serverInfo: {
      name: "shubham-gupta-portfolio",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    disableSse: true,
    maxDuration,
  }
)

export { handler as GET, handler as POST, handler as DELETE }
