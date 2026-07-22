import { NextResponse, after } from "next/server"
import { Redis } from "@upstash/redis"
import { sendBark, resolveGeo, type BarkPayload } from "@/lib/bark"

// Visitor-activity → Bark push. The browser fires small beacons at this
// route (see lib/notify.ts); we validate against an event allowlist, cap
// every field, rate-limit per IP, and forward to Bark after the response.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const RATE_LIMIT_PER_MINUTE = 20

// Control characters out, length capped — these strings end up on my phone.
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return ""
  return value.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, max)
}

type Data = Record<string, unknown>

// One builder per allowed event — anything else is rejected. Location is
// appended centrally after geo resolution.
const BUILDERS: Record<string, (data: Data) => BarkPayload | null> = {
  visit: (data) => {
    const referrer = clean(data.referrer, 200)
    return {
      title: "👋 New visitor",
      body: referrer ? `via ${referrer}` : "direct visit",
    }
  },

  message: (data) => {
    const name = clean(data.name, 120) || "anonymous"
    const message = clean(data.message, 500)
    if (!message) return null
    return {
      title: `📨 Message from ${name}`,
      body: message,
      level: "timeSensitive",
    }
  },

  link: (data) => {
    const href = clean(data.href, 300)
    if (!href) return null
    const label = clean(data.label, 80) || "link"
    const source = clean(data.source, 80)
    return {
      title: `🔗 Visited: ${label}`,
      body: source ? `${source} → ${href}` : href,
    }
  },

  share: (data) => {
    const target = clean(data.target, 80)
    if (!target) return null
    return {
      title: "🔁 Link copied",
      body: `→ ${target}`,
    }
  },

  card_focused: (data) => {
    const label = clean(data.label, 80)
    if (!label) return null
    const count = clean(data.count, 10)
    const trail = clean(data.trail, 400)
    return {
      title: `🗂️ Card viewed: ${label}`,
      body:
        [
          count ? `${count} card${count === "1" ? "" : "s"} this session` : null,
          trail ? `trail: ${trail}` : null,
        ]
          .filter(Boolean)
          .join("\n") || label,
    }
  },

  video_played: (data) => {
    const label = clean(data.label, 80)
    if (!label) return null
    return {
      title: `▶️ Video played: ${label}`,
      body: label,
    }
  },

  tour_started: () => ({
    title: "🎬 Tour started",
    body: "someone is taking the walkthrough",
  }),

  tour_completed: () => ({
    title: "🏁 Tour completed",
    body: "they made it to the end",
  }),

  konami: () => ({
    title: "🕹️ Konami code found!",
    body: "↑↑↓↓←→←→BA",
  }),
}

async function isRateLimited(headers: Headers): Promise<boolean> {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"

  try {
    const key = `portfolio:notify:rl:${ip}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 60)
    return count > RATE_LIMIT_PER_MINUTE
  } catch {
    // Redis down shouldn't silence notifications.
    return false
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    event?: string
    data?: Data
  } | null

  const builder = body?.event ? BUILDERS[body.event] : undefined
  if (!builder) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (await isRateLimited(request.headers)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  const data = body?.data ?? {}
  const payload = builder(data)
  if (!payload) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Every beacon carries the visitor's PostHog session id: printed in the
  // body for lookup, and used as the Bark group so all pushes from one
  // visitor session stack together in the notification center.
  const sessionId = clean(data.sessionId, 120)
  if (sessionId) {
    payload.body += `\nposthog session: ${sessionId}`
    payload.group = sessionId
  }

  // Respond immediately; resolve the visitor's location and deliver the
  // push after the response is sent.
  after(async () => {
    const geo = await resolveGeo(request.headers)
    if (geo) payload.body += `\n📍 ${geo}`
    await sendBark(payload)
  })
  return NextResponse.json({ ok: true })
}
