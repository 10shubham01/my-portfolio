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

export function notifyActivity(
  event: ActivityEvent,
  data: Record<string, string | undefined> = {}
) {
  if (typeof window === "undefined") return

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
