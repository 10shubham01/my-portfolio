import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const noStore = { "cache-control": "no-store" } as const

function loveKey(id: string) {
  return `project:${id}:loves`
}
function commentsKey(id: string) {
  return `project:${id}:comments`
}

interface Comment {
  id: string
  name: string
  text: string
  ts: number
}

const MAX_NAME = 40
const MAX_TEXT = 280
const MAX_COMMENTS = 200

function sanitize(s: unknown, max: number): string {
  if (typeof s !== "string") return ""
  return s.trim().slice(0, max)
}

// GET ?projectId=xxx&cursor=0&limit=5
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 })
  }

  try {
    const [loves, raw] = await Promise.all([
      redis.get<number>(loveKey(projectId)),
      redis.lrange<Comment>(commentsKey(projectId), 0, -1),
    ])

    const comments = Array.isArray(raw) ? raw : []
    const cursor = parseInt(searchParams.get("cursor") ?? "0", 10) || 0
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "3", 10) || 3, 20)
    const slice = comments.slice(cursor, cursor + limit)
    const hasMore = cursor + limit < comments.length

    return NextResponse.json(
      {
        loves: loves ?? 0,
        comments: slice,
        totalComments: comments.length,
        hasMore,
        nextCursor: hasMore ? cursor + limit : null,
      },
      { headers: noStore },
    )
  } catch {
    return NextResponse.json(
      { loves: 0, comments: [], totalComments: 0, hasMore: false, nextCursor: null },
      { headers: noStore },
    )
  }
}

// POST { projectId, action: "love"|"unlove"|"comment", name?, text? }
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const projectId = sanitize(body.projectId, 60)
  const action = body.action as string
  if (!projectId || !["love", "unlove", "comment"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  try {
    if (action === "love" || action === "unlove") {
      let count =
        action === "unlove"
          ? await redis.decr(loveKey(projectId))
          : await redis.incr(loveKey(projectId))
      if (count < 0) {
        await redis.set(loveKey(projectId), 0)
        count = 0
      }
      return NextResponse.json({ loves: count }, { headers: noStore })
    }

    // action === "comment"
    const name = sanitize(body.name, MAX_NAME) || "Anonymous"
    const text = sanitize(body.text, MAX_TEXT)
    if (!text) {
      return NextResponse.json({ error: "Empty comment" }, { status: 400 })
    }

    const comment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      text,
      ts: Date.now(),
    }

    await redis.lpush(commentsKey(projectId), comment)
    await redis.ltrim(commentsKey(projectId), 0, MAX_COMMENTS - 1)

    return NextResponse.json({ comment }, { headers: noStore })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: noStore })
  }
}
