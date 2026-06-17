import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Single browser Supabase client, created lazily. Returns null when the
 * NEXT_PUBLIC_SUPABASE_* env vars aren't set so live presence cursors degrade
 * gracefully instead of crashing the canvas.
 *
 * See SUPABASE_SETUP.md for env var setup.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

export const isSupabaseEnabled = Boolean(url && anonKey)

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled) return null
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      realtime: { params: { eventsPerSecond: 20 } },
      auth: { persistSession: false },
    })
  }
  return client
}

/** Shared realtime room every visitor of the canvas joins. */
export const CANVAS_ROOM = "portfolio-canvas"
