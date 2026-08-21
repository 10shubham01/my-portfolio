"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Send, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  name: string
  text: string
  ts: number
}

const INITIAL_LIMIT = 3

const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const timeFmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
function relativeTime(ts: number) {
  const diff = (ts - Date.now()) / 1000
  if (Math.abs(diff) < 60) return "just now"
  if (Math.abs(diff) < 3600) return timeFmt.format(Math.round(diff / 60), "minute")
  if (Math.abs(diff) < 86400) return timeFmt.format(Math.round(diff / 3600), "hour")
  return timeFmt.format(Math.round(diff / 86400), "day")
}

function storageKey(projectId: string) {
  return `project-loved:${projectId}`
}

export function ProjectReactions({ projectId }: { projectId: string }) {
  const [loves, setLoves] = useState(0)
  const [loved, setLoved] = useState(false)
  const [bump, setBump] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [totalComments, setTotalComments] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [posting, setPosting] = useState(false)
  const inFlight = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoved(localStorage.getItem(storageKey(projectId)) === "1")
    fetch(`/api/project-reactions?projectId=${encodeURIComponent(projectId)}&limit=${INITIAL_LIMIT}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.loves === "number") setLoves(data.loves)
        if (Array.isArray(data.comments)) setComments(data.comments)
        if (typeof data.totalComments === "number") setTotalComments(data.totalComments)
        if (typeof data.hasMore === "boolean") setHasMore(data.hasMore)
        if (data.nextCursor != null) setNextCursor(data.nextCursor)
      })
      .catch(() => {})
  }, [projectId])

  const toggleLove = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true

    const next = !loved
    setLoved(next)
    setLoves((c) => Math.max(0, c + (next ? 1 : -1)))
    setBump(true)
    setTimeout(() => setBump(false), 300)
    localStorage.setItem(storageKey(projectId), next ? "1" : "0")

    try {
      const res = await fetch("/api/project-reactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId, action: next ? "love" : "unlove" }),
      })
      const data = await res.json()
      if (typeof data.loves === "number") setLoves(data.loves)
    } catch {
      setLoved(!next)
      setLoves((c) => Math.max(0, c + (next ? -1 : 1)))
      localStorage.setItem(storageKey(projectId), !next ? "1" : "0")
    } finally {
      inFlight.current = false
    }
  }, [loved, projectId])

  const loadMore = useCallback(async () => {
    if (loadingMore || nextCursor == null) return
    setLoadingMore(true)
    try {
      const res = await fetch(
        `/api/project-reactions?projectId=${encodeURIComponent(projectId)}&cursor=${nextCursor}&limit=${INITIAL_LIMIT}`,
      )
      const data = await res.json()
      if (Array.isArray(data.comments)) setComments((prev) => [...prev, ...data.comments])
      if (typeof data.hasMore === "boolean") setHasMore(data.hasMore)
      setNextCursor(data.nextCursor ?? null)
    } catch {
      // ignore
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, nextCursor, projectId])

  const submitComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = text.trim()
      if (!trimmed || posting) return
      setPosting(true)

      try {
        const res = await fetch("/api/project-reactions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ projectId, action: "comment", name: name.trim(), text: trimmed }),
        })
        const data = await res.json()
        if (data.comment) {
          setComments((prev) => [data.comment, ...prev])
          setTotalComments((c) => c + 1)
          setText("")
        }
      } catch {
        // ignore
      } finally {
        setPosting(false)
      }
    },
    [text, name, posting, projectId],
  )

  return (
    <div
      className="flex flex-col gap-0 pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Action bar: heart + comment toggle */}
      <div className="flex items-center gap-3 px-1 py-1.5">
        <button
          type="button"
          onClick={toggleLove}
          className="group/love flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0"
          aria-pressed={loved}
          aria-label={loved ? "Unlike project" : "Like project"}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            className={cn(
              "transition-all duration-200 group-hover/love:scale-110",
              loved ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-gray-400 dark:stroke-neutral-500",
              bump && "animate-[love-pop_0.3s_ease-out]",
            )}
          />
          <span
            className={cn(
              "font-mono text-[11px] tabular-nums",
              loved ? "text-red-500" : "text-gray-400 dark:text-neutral-500",
            )}
          >
            {compactFmt.format(loves)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowComments((v) => !v)
            if (!showComments) setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="group/cmt flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0"
          aria-label={showComments ? "Hide comments" : "Show comments"}
        >
          <MessageCircle
            size={17}
            strokeWidth={1.8}
            className={cn(
              "transition-colors duration-200 group-hover/cmt:stroke-gray-600 dark:group-hover/cmt:stroke-neutral-300",
              showComments
                ? "fill-[#18A0FB]/10 stroke-[#18A0FB]"
                : "fill-transparent stroke-gray-400 dark:stroke-neutral-500",
            )}
          />
          {totalComments > 0 && (
            <span className="font-mono text-[11px] tabular-nums text-gray-400 dark:text-neutral-500">
              {compactFmt.format(totalComments)}
            </span>
          )}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="flex flex-col gap-2 rounded-md border border-gray-200/80 bg-white px-3 py-2.5 dark:border-neutral-700/60 dark:bg-neutral-900">
          {/* Comment list */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-2">
              {comments.map((c) => (
                <div key={c.id} className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-geist text-[12px] font-medium text-gray-800 dark:text-neutral-200">
                      {c.name}
                    </span>
                    <span className="font-mono text-[9px] text-gray-300 dark:text-neutral-600">
                      {relativeTime(c.ts)}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-gray-500 dark:text-neutral-400">
                    {c.text}
                  </p>
                </div>
              ))}

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-mono text-[10px] text-gray-400 transition-colors hover:text-[#18A0FB] disabled:opacity-50 dark:text-neutral-500"
                >
                  <ChevronDown size={12} />
                  {loadingMore ? "Loading…" : `Show more (${totalComments - comments.length})`}
                </button>
              )}
            </div>
          )}

          {comments.length === 0 && (
            <p className="py-1 font-mono text-[11px] text-gray-300 dark:text-neutral-600">
              No comments yet — be the first!
            </p>
          )}

          {/* Comment form */}
          <form onSubmit={submitComment} className="flex flex-col gap-1.5 border-t border-gray-100 pt-2 dark:border-neutral-800">
            <input
              ref={inputRef}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full rounded border border-gray-200 bg-transparent px-2 py-1 font-geist text-[11px] text-gray-700 placeholder:text-gray-300 focus:border-[#18A0FB] focus:outline-none dark:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-600"
            />
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Add a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
                className="flex-1 rounded border border-gray-200 bg-transparent px-2 py-1 font-geist text-[11px] text-gray-700 placeholder:text-gray-300 focus:border-[#18A0FB] focus:outline-none dark:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-600"
              />
              <button
                type="submit"
                disabled={!text.trim() || posting}
                className="flex shrink-0 cursor-pointer items-center justify-center rounded border border-gray-200 bg-transparent p-1.5 text-gray-400 transition-colors hover:border-[#18A0FB] hover:text-[#18A0FB] disabled:cursor-default disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-500"
                aria-label="Post comment"
              >
                <Send size={12} strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
