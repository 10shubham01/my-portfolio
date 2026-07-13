import nowJson from "@/data/now.json"

export const NOW = nowJson

/** Content older than this (in days) is flagged so the UI can nudge a refresh. */
export const NOW_STALE_AFTER_DAYS = 45

export interface NowFreshness {
  /** Human relative label, e.g. "today", "2 weeks ago", "3 months ago". */
  label: string
  /** Absolute month label, e.g. "Jul 2026" — used as the tooltip. */
  absolute: string
  /** True once the content is older than NOW_STALE_AFTER_DAYS. */
  stale: boolean
}

/** Absolute month label ("Jul 2026") from an ISO date; echoes bad input back. */
export function formatUpdatedMonth(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

/**
 * Turns the "Now" card's ISO update date into an always-honest, relative
 * freshness readout computed against `now` — so the stamp reads "2 weeks ago"
 * instead of a hardcoded month that silently rots. `now` is injected (not read
 * from the clock) to keep this pure and unit-testable.
 */
export function getNowFreshness(iso: string, now: Date): NowFreshness {
  const updated = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(updated.getTime())) {
    return { label: iso, absolute: iso, stale: false }
  }

  const absolute = formatUpdatedMonth(iso)
  const days = Math.max(
    0,
    Math.floor((now.getTime() - updated.getTime()) / 86_400_000)
  )

  let label: string
  if (days <= 0) label = "today"
  else if (days === 1) label = "yesterday"
  else if (days < 7) label = `${days} days ago`
  else if (days < 14) label = "1 week ago"
  else if (days < 30) label = `${Math.floor(days / 7)} weeks ago`
  else if (days < 60) label = "1 month ago"
  else label = `${Math.round(days / 30)} months ago`

  return { label, absolute, stale: days >= NOW_STALE_AFTER_DAYS }
}
