"use client"

import { useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import { posthogSessionContext } from "@/lib/notify"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export const LOVE_STORAGE_KEY = "portfolio-loved"
const STORAGE_KEY = LOVE_STORAGE_KEY

// Tell the rest of the canvas (e.g. the dock's heart) that the loved state
// changed, so mirrored icons stay in sync.
function broadcastLoved(loved: boolean) {
  window.dispatchEvent(
    new CustomEvent("canvas:love-changed", { detail: { loved } })
  )
}

// Compact counts: 5000 → "5K", 5100 → "5.1K", 1_200_000 → "1.2M".
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const HEART_PATH =
  "M24 40.5C24 40.5 4.5 29.5 4.5 15.8C4.5 9.4 9.6 5 15 5.2C19.7 5.4 22.8 8.6 24 12.4C25.4 8.5 28.2 5.2 33.2 5C38.7 4.8 43.5 9.6 43.3 15.8C42.9 29.4 24 40.5 24 40.5Z"

// A slightly wobbly, off-centre heart so it reads as hand-drawn rather than a
// crisp geometric icon. Nuances that sell the marker-pen feel:
//  - a faint second "sketch pass" of the outline, offset a hair, so the line
//    looks re-traced by hand rather than printed;
//  - round joins/caps for a soft-tip pen;
//  - a soft shine highlight on the upper-left lobe once it's filled.
// Grey outline until loved, then flooded red (stroke included).
function HandDrawnHeart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 48 44"
      className="h-full w-full overflow-visible"
      aria-hidden
    >
      {/* faint hand-drawn second pass of the outline */}
      <path
        d={HEART_PATH}
        className={cn(
          "fill-transparent transition-colors duration-200",
          filled ? "stroke-red-500" : "stroke-gray-400 dark:stroke-neutral-500"
        )}
        strokeWidth={1.1}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.4}
        transform="translate(0.7 0.9) rotate(-1.2 24 22)"
      />

      {/* main heart */}
      <path
        d={HEART_PATH}
        className={cn(
          "transition-colors duration-200",
          filled
            ? "fill-red-500 stroke-red-500"
            : "fill-transparent stroke-gray-400 dark:stroke-neutral-500"
        )}
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* shine highlight — a short curved streak on the upper-left lobe */}
      <path
        d="M11.5 17.5C11 13.8 12.6 10.9 15.8 10.4"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        className="transition-opacity duration-200"
        opacity={filled ? 0.7 : 0}
      />
    </svg>
  )
}

export function LoveCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const [count, setCount] = useState<number | null>(null)
  const [loved, setLoved] = useState(false)
  const [bump, setBump] = useState(false)
  const inFlight = useRef(false)
  const toggleRef = useRef<() => void>(() => {})

  // Initial load: current global count + whether this browser already loved it.
  useEffect(() => {
    setLoved(
      typeof window !== "undefined" &&
        window.localStorage.getItem(STORAGE_KEY) === "1"
    )

    let cancelled = false
    fetch("/api/love")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data?.count === "number") setCount(data.count)
      })
      .catch(() => {
        if (!cancelled) setCount(0)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Programmatic love (e.g. the dock's heart button): loves the portfolio if
  // this browser hasn't already — never undoes an existing love.
  useEffect(() => {
    const onLove = () => {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return
      toggleRef.current()
    }
    window.addEventListener("canvas:love", onLove)
    return () => window.removeEventListener("canvas:love", onLove)
  }, [])

  async function toggle() {
    if (inFlight.current) return
    inFlight.current = true

    const nextLoved = !loved
    const action = nextLoved ? "love" : "unlove"

    // Optimistic update — feels instant; reconciled with the server below.
    setLoved(nextLoved)
    broadcastLoved(nextLoved)
    setCount((c) => Math.max(0, (c ?? 0) + (nextLoved ? 1 : -1)))
    setBump(true)
    window.setTimeout(() => setBump(false), 300)

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLoved ? "1" : "0")
      posthog.capture("portfolio_loved", { action })

      const res = await fetch("/api/love", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Session context lets the Bark push deep-link into the PostHog replay.
        body: JSON.stringify({ action, ...posthogSessionContext() }),
      })
      const data = await res.json()
      if (typeof data?.count === "number") setCount(data.count)

      // After loving it, fly the viewer to the contact slip to say hi — but
      // only on love, never on undo. Delayed so the heart-pop plays first.
      if (nextLoved) {
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("canvas:focus-item", { detail: { id: "contact" } })
          )
        }, 450)
      }
    } catch {
      // Roll back on failure.
      setLoved(!nextLoved)
      broadcastLoved(!nextLoved)
      setCount((c) => Math.max(0, (c ?? 0) + (nextLoved ? -1 : 1)))
      window.localStorage.setItem(STORAGE_KEY, !nextLoved ? "1" : "0")
    } finally {
      inFlight.current = false
    }
  }

  useEffect(() => {
    toggleRef.current = toggle
  })

  return (
    <div ref={ref} className="flex h-full w-full flex-col items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={loved}
        aria-label={
          loved ? "You loved this portfolio — tap to undo" : "Love this portfolio"
        }
        // Always clickable, even when the card isn't the selected frame, so a
        // single tap loves it. The canvas frame ignores pointer-downs landing
        // on a <button>, so this never fights the drag/select gesture.
        className="group relative cursor-pointer border-0 bg-transparent p-0 [pointer-events:auto]"
      >
        <span
          className={cn(
            "block h-16 w-16 origin-bottom transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95",
            bump && "animate-[love-pop_0.3s_ease-out]"
          )}
        >
          <HandDrawnHeart filled={loved} />
        </span>
      </button>

      <span
        className={cn(
          "font-geist text-[13px] leading-none font-medium tabular-nums tracking-tight transition-colors duration-200",
          loved ? "text-red-500" : "text-gray-400 dark:text-neutral-500"
        )}
      >
        {count === null ? "··" : compactFormatter.format(count)}
      </span>
    </div>
  )
}
