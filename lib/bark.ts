// Server-only Bark (day.app) push notifications — every notable visitor
// action on the portfolio lands on my phone. The device key stays in
// BARK_KEY; the browser only ever talks to our own /api routes.

const BARK_HOST = process.env.BARK_URL ?? "https://api.day.app"

export interface BarkPayload {
  title: string
  body: string
  /** Tapping the notification opens this. */
  url?: string
  group?: string
  sound?: string
  level?: "active" | "timeSensitive" | "passive"
}

export async function sendBark(payload: BarkPayload): Promise<boolean> {
  const key = process.env.BARK_KEY
  if (!key) return false

  try {
    const res = await fetch(`${BARK_HOST}/${key}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        group: "portfolio",
        isArchive: 1,
        ...payload,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    // Notifications must never take a request down with them.
    return false
  }
}

// "Mumbai, Maharashtra, IN" from Vercel's geo headers; null when absent.
export function geoFromHeaders(headers: Headers): string | null {
  const city = headers.get("x-vercel-ip-city")
  const region = headers.get("x-vercel-ip-country-region")
  const country = headers.get("x-vercel-ip-country")
  if (!city && !country) return null
  return [
    city ? decodeURIComponent(city) : null,
    region ? decodeURIComponent(region) : null,
    country,
  ]
    .filter(Boolean)
    .join(", ")
}

function clientIp(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip")
  )
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.toLowerCase().startsWith("fc") ||
    ip.toLowerCase().startsWith("fe80")
  )
}

// Visitor location, PostHog-style: Vercel's geo headers when deployed there,
// otherwise a GeoIP lookup on the client IP. Null on localhost.
export async function resolveGeo(headers: Headers): Promise<string | null> {
  const fromHeaders = geoFromHeaders(headers)
  if (fromHeaders) return fromHeaders

  const ip = clientIp(headers)
  if (!ip || isPrivateIp(ip)) return null

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    })
    const data = (await res.json()) as {
      success?: boolean
      city?: string
      region?: string
      country_code?: string
    }
    if (!data?.success) return null
    return (
      [data.city, data.region, data.country_code].filter(Boolean).join(", ") ||
      null
    )
  } catch {
    return null
  }
}
