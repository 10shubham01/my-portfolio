import { Redis } from "@upstash/redis"
import { NextResponse, after } from "next/server"
import { sendBark, resolveGeo } from "@/lib/bark"

// Global "love the portfolio" counter, stored in Upstash Redis. Server-only —
// the tokens live in KV_REST_API_* env vars and are never sent to the client;
// the browser only ever talks to this route.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const KEY = "portfolio:love:count"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const noStore = { "cache-control": "no-store" }

// GET → current love count.
export async function GET() {
  try {
    const count = (await redis.get<number>(KEY)) ?? 0
    return NextResponse.json({ count }, { headers: noStore })
  } catch {
    return NextResponse.json({ count: 0 }, { headers: noStore })
  }
}

// POST { action: "love" | "unlove" } → increment / decrement, clamped at 0.
export async function POST(request: Request) {
  const { action, sessionId } = (await request
    .json()
    .catch(() => ({ action: "love" as const }))) as {
    action?: "love" | "unlove"
    sessionId?: unknown
  }

  try {
    let count =
      action === "unlove" ? await redis.decr(KEY) : await redis.incr(KEY)

    // A decrement can dip below zero if state ever drifts — floor it.
    if (count < 0) {
      await redis.set(KEY, 0)
      count = 0
    }

    // Push the moment to my phone — after the response, never blocking it.
    // The PostHog session id in the body links the push to the session.
    const total = count
    const session =
      typeof sessionId === "string" ? sessionId.slice(0, 120) : null
    after(async () => {
      const geo = await resolveGeo(request.headers)
      await sendBark({
        title: action === "unlove" ? "💔 Love removed" : "❤️ Portfolio loved",
        body: `${total} total${session ? `\nposthog session: ${session}` : ""}${geo ? `\n📍 ${geo}` : ""}`,
      })
    })

    return NextResponse.json({ count }, { headers: noStore })
  } catch {
    return NextResponse.json(
      { error: "Could not update love count" },
      { status: 500, headers: noStore }
    )
  }
}
