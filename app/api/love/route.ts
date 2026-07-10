import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

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
  const { action } = await request
    .json()
    .catch(() => ({ action: "love" as const }))

  try {
    let count =
      action === "unlove" ? await redis.decr(KEY) : await redis.incr(KEY)

    // A decrement can dip below zero if state ever drifts — floor it.
    if (count < 0) {
      await redis.set(KEY, 0)
      count = 0
    }

    return NextResponse.json({ count }, { headers: noStore })
  } catch {
    return NextResponse.json(
      { error: "Could not update love count" },
      { status: 500, headers: noStore }
    )
  }
}
