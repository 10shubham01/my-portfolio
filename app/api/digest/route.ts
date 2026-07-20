import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { sendBark } from "@/lib/bark"

// Daily analytics digest → one Bark push every morning (scheduled in
// vercel.json, 05:30 UTC = 11:00 IST). Yesterday's numbers come from
// PostHog's HogQL API; the all-time love total from Redis.
//
// Env: POSTHOG_API_KEY (personal key, phx_…) is the only required addition —
// the API host is derived from NEXT_PUBLIC_POSTHOG_HOST and the project id
// is resolved from the key. POSTHOG_PROJECT_ID / POSTHOG_API_HOST /
// CRON_SECRET are optional overrides.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// The private API lives at us.posthog.com — the NEXT_PUBLIC host is the
// ingestion endpoint (us.i.posthog.com), so strip the ".i".
const PH_HOST =
  process.env.POSTHOG_API_HOST ??
  (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com").replace(
    ".i.posthog.com",
    ".posthog.com"
  )

type Row = (string | number | null)[]

let cachedProjectId: string | null = null

async function resolveProjectId(key: string): Promise<string> {
  if (process.env.POSTHOG_PROJECT_ID) return process.env.POSTHOG_PROJECT_ID
  if (cachedProjectId) return cachedProjectId

  const res = await fetch(`${PH_HOST}/api/projects/@current/`, {
    headers: { authorization: `Bearer ${key}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`posthog projects ${res.status}`)
  const data = (await res.json()) as { id?: number }
  if (!data.id) throw new Error("posthog project id not found")
  cachedProjectId = String(data.id)
  return cachedProjectId
}

async function hogql(query: string): Promise<Row[]> {
  const key = process.env.POSTHOG_API_KEY
  if (!key) throw new Error("posthog api not configured")
  const projectId = await resolveProjectId(key)

  const res = await fetch(`${PH_HOST}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`posthog ${res.status}`)
  const data = (await res.json()) as { results?: Row[] }
  return data.results ?? []
}

const safe = <T,>(promise: Promise<T>, fallback: T): Promise<T> =>
  promise.catch(() => fallback)

// "linkedin.com (9), x.com (4)" — drops empty keys and PostHog's "$direct".
function formatTop(rows: Row[], max: number): string {
  return rows
    .filter(([key]) => key && key !== "$direct")
    .slice(0, max)
    .map(([key, count]) => `${key} (${count})`)
    .join(", ")
}

export async function GET(request: Request) {
  // Vercel attaches this header to cron invocations when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const YESTERDAY = "toDate(timestamp) = yesterday()"

  const [counts, loves, visitors, topCards, topReferrers, topCountries, loveTotal] =
    await Promise.all([
      safe(
        hogql(
          `SELECT event, count() FROM events WHERE ${YESTERDAY}
           AND event IN ('$pageview','contact_submitted','contact_reaction',
                         'tour_started','tour_completed','link_clicked')
           GROUP BY event`
        ),
        [] as Row[]
      ),
      safe(
        hogql(
          `SELECT properties.action, count() FROM events
           WHERE ${YESTERDAY} AND event = 'portfolio_loved' GROUP BY 1`
        ),
        [] as Row[]
      ),
      safe(
        hogql(
          `SELECT count(DISTINCT person_id) FROM events
           WHERE ${YESTERDAY} AND event = '$pageview'`
        ),
        [] as Row[]
      ),
      safe(
        hogql(
          `SELECT properties.item_label, count() FROM events
           WHERE ${YESTERDAY} AND event = 'canvas_item_focused'
           AND properties.item_label IS NOT NULL
           GROUP BY 1 ORDER BY 2 DESC LIMIT 3`
        ),
        [] as Row[]
      ),
      safe(
        hogql(
          `SELECT properties.$referring_domain, count(DISTINCT person_id)
           FROM events WHERE ${YESTERDAY} AND event = '$pageview'
           GROUP BY 1 ORDER BY 2 DESC LIMIT 4`
        ),
        [] as Row[]
      ),
      safe(
        hogql(
          `SELECT properties.$geoip_country_name, count(DISTINCT person_id)
           FROM events WHERE ${YESTERDAY} AND event = '$pageview'
           AND properties.$geoip_country_name IS NOT NULL
           GROUP BY 1 ORDER BY 2 DESC LIMIT 3`
        ),
        [] as Row[]
      ),
      safe(redis.get<number>("portfolio:love:count"), null),
    ])

  const byEvent = Object.fromEntries(
    counts.map(([event, count]) => [event, Number(count)])
  )
  const lovesYesterday = Number(
    loves.find(([action]) => action === "love")?.[1] ?? 0
  )
  const uniqueVisitors = Number(visitors[0]?.[0] ?? 0)

  const lines = [
    `Visitors: ${uniqueVisitors} (${byEvent.$pageview ?? 0} pageviews)`,
    `Loves: ${lovesYesterday}${loveTotal !== null ? ` (${loveTotal} total)` : ""}`,
    `Messages: ${byEvent.contact_submitted ?? 0} | Reactions: ${byEvent.contact_reaction ?? 0}`,
    `Tours: ${byEvent.tour_started ?? 0} started, ${byEvent.tour_completed ?? 0} completed`,
    `Link clicks: ${byEvent.link_clicked ?? 0}`,
  ]

  const cards = formatTop(topCards, 3)
  if (cards) lines.push(`Top cards: ${cards}`)
  const referrers = formatTop(topReferrers, 3)
  if (referrers) lines.push(`Referrers: ${referrers}`)
  const countries = formatTop(topCountries, 3)
  if (countries) lines.push(`Countries: ${countries}`)

  const configured = !!process.env.POSTHOG_API_KEY
  if (!configured) {
    lines.push("Note: set POSTHOG_API_KEY for full stats")
  }

  const date = new Date(Date.now() - 86_400_000).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  const sent = await sendBark({
    title: `Daily digest — ${date}`,
    body: lines.join("\n"),
    group: "digest",
  })

  return NextResponse.json({ ok: true, sent, configured })
}
