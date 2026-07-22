// Fire-and-forget activity beacons → /api/notify → Bark push on my phone.
// sendBeacon survives page unloads (e.g. a visitor clicking an external
// link), and nothing here can ever throw into the UI.

import posthog from "posthog-js"

// The visitor's PostHog session id, attached to every beacon so the push can
// be matched to the session in PostHog.
export function posthogSessionContext(): { sessionId?: string } {
  if (typeof window === "undefined") return {}
  try {
    return { sessionId: posthog.get_session_id?.() || undefined }
  } catch {
    return {}
  }
}

export type ActivityEvent =
  | "visit"
  | "message"
  | "link"
  | "share"
  | "tour_started"
  | "tour_completed"
  | "konami"
  | "card_focused"
  | "video_played"

// Distinct cards this visitor has focused, in navigation order. Each first
// focus of a card sends one push carrying the running count and full trail,
// so a single notification answers "how many cards, and which ones". Repeat
// focuses of an already-seen card stay silent.
const CARD_TRAIL_KEY = "portfolio:card-trail"

export function notifyCardFocus(id: string, label: string) {
  if (typeof window === "undefined") return

  try {
    let trail: { id: string; label: string }[] = []
    try {
      const stored = JSON.parse(sessionStorage.getItem(CARD_TRAIL_KEY) ?? "[]")
      if (Array.isArray(stored)) trail = stored
    } catch {
      // Corrupt storage → start a fresh trail.
    }

    if (trail.some((entry) => entry.id === id)) return
    trail.push({ id, label })
    sessionStorage.setItem(CARD_TRAIL_KEY, JSON.stringify(trail))

    notifyActivity("card_focused", {
      label,
      count: String(trail.length),
      trail: trail.map((entry) => entry.label).join(" → "),
    })
  } catch {
    // Never let telemetry break the page.
  }
}

// Videos this visitor has played. First play of each video sends one push;
// replays after re-focusing the card stay silent.
const VIDEOS_PLAYED_KEY = "portfolio:videos-played"

export function notifyVideoPlay(id: string, label: string) {
  if (typeof window === "undefined") return

  try {
    let played: string[] = []
    try {
      const stored = JSON.parse(sessionStorage.getItem(VIDEOS_PLAYED_KEY) ?? "[]")
      if (Array.isArray(stored)) played = stored
    } catch {
      // Corrupt storage → treat as nothing played yet.
    }

    if (played.includes(id)) return
    played.push(id)
    sessionStorage.setItem(VIDEOS_PLAYED_KEY, JSON.stringify(played))

    notifyActivity("video_played", { label })
  } catch {
    // Never let telemetry break the page.
  }
}

// Local development shouldn't ping my phone.
function isLocalhost(): boolean {
  const host = window.location.hostname
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]"
}

export function notifyActivity(
  event: ActivityEvent,
  data: Record<string, string | undefined> = {}
) {
  if (typeof window === "undefined") return
  if (isLocalhost()) return

  try {
    const payload = JSON.stringify({
      event,
      data: { ...posthogSessionContext(), ...data },
    })

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" })
      if (navigator.sendBeacon("/api/notify", blob)) return
    }

    fetch("/api/notify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never let telemetry break the page.
  }
}
