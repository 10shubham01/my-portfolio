"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getSupabase, CANVAS_ROOM } from "@/lib/supabase"
import { getVisitorIdentity } from "@/lib/visitor-identity"

export type RemoteCursor = {
  id: string
  name: string
  color: string
  /** Canvas-space coordinates (not screen) so cursors pan & zoom with the board. */
  x: number
  y: number
  at: number
}

type CursorPayload = Omit<RemoteCursor, "at">

export type PresenceMember = {
  id: string
  name: string
  color: string
  /** True for the current visitor. */
  self: boolean
}

const STALE_MS = 6000
const BROADCAST_THROTTLE_MS = 45

/**
 * Joins the shared realtime room and exposes:
 *  - `members`— everyone exploring right now (incl. you), with name + color
 *  - `count`  — how many visitors that is
 *  - `cursors`— other visitors' live cursors in canvas-space
 *  - `sendCursor` — throttled broadcaster for your own cursor
 *
 * No-ops cleanly when Supabase isn't configured.
 */
export function useCanvasPresence(enabled: boolean) {
  const [members, setMembers] = useState<PresenceMember[]>([])
  const [cursors, setCursors] = useState<RemoteCursor[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)
  const cursorsRef = useRef<Map<string, RemoteCursor>>(new Map())
  const lastSentRef = useRef(0)
  const identityRef = useRef(getVisitorIdentity())

  const flushCursors = useCallback(() => {
    setCursors(Array.from(cursorsRef.current.values()))
  }, [])

  useEffect(() => {
    if (!enabled) return
    const supabase = getSupabase()
    if (!supabase) return

    const identity = identityRef.current
    const cursorMap = cursorsRef.current
    const channel = supabase.channel(CANVAS_ROOM, {
      config: { presence: { key: identity.id } },
    })
    channelRef.current = channel

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ id: string; name: string; color: string }>()
        const next = Object.values(state)
          .map((metas) => metas[0])
          .filter(Boolean)
          .map((meta) => ({
            id: meta.id,
            name: meta.name,
            color: meta.color,
            self: meta.id === identity.id,
          }))
        setMembers(next)
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        cursorsRef.current.delete(key)
        flushCursors()
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const data = payload as CursorPayload
        if (data.id === identity.id) return
        cursorsRef.current.set(data.id, { ...data, at: Date.now() })
        flushCursors()
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: identity.id,
            name: identity.name,
            color: identity.color,
          })
        }
      })

    // Drop cursors that have gone quiet (tab switched, left, etc.)
    const sweep = window.setInterval(() => {
      const now = Date.now()
      let changed = false
      for (const [key, cursor] of cursorsRef.current) {
        if (now - cursor.at > STALE_MS) {
          cursorsRef.current.delete(key)
          changed = true
        }
      }
      if (changed) flushCursors()
    }, 2000)

    return () => {
      window.clearInterval(sweep)
      supabase.removeChannel(channel)
      channelRef.current = null
      cursorMap.clear()
    }
  }, [enabled, flushCursors])

  const sendCursor = useCallback((x: number, y: number) => {
    const channel = channelRef.current
    if (!channel) return
    const now = Date.now()
    if (now - lastSentRef.current < BROADCAST_THROTTLE_MS) return
    lastSentRef.current = now

    const identity = identityRef.current
    channel.send({
      type: "broadcast",
      event: "cursor",
      payload: { id: identity.id, name: identity.name, color: identity.color, x, y },
    })
  }, [])

  return { members, count: members.length, cursors, sendCursor }
}
