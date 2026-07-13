"use client"

import { useEffect, useState } from "react"
import { SITE } from "@/lib/canvas-data"
import { CardSurface, cardMetaClass } from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

// Shubham is in Mumbai — the clock ticks in his timezone so visitors abroad
// see "what time it is where I am" rather than their own local time.
const TIME_ZONE = "Asia/Kolkata"

type Clock = {
  hours: string
  minutes: string
  seconds: string
  meridiem: string
  weekday: string
  date: string
}

function readClock(now: Date): Clock {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(now)

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    time.find((p) => p.type === type)?.value ?? ""

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
  }).format(now)

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
  }).format(now)

  return {
    hours: part("hour"),
    minutes: part("minute"),
    seconds: part("second"),
    meridiem: part("dayPeriod").toUpperCase(),
    weekday,
    date,
  }
}

export function ClockCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  // Rendered only after mount: the time is client-only, so SSR emits an empty
  // shell and we never risk a hydration mismatch on the ticking digits.
  const [clock, setClock] = useState<Clock | null>(null)

  useEffect(() => {
    setClock(readClock(new Date()))
    const id = window.setInterval(() => setClock(readClock(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <CardSurface
      ref={ref}
      interactive={interactive}
      className="border-0 bg-transparent !p-5 shadow-none dark:bg-transparent"
    >
      <span className="font-mono text-[10px] tracking-[0.28em] text-gray-400 uppercase dark:text-neutral-500">
        {SITE.location} · IST
      </span>

      <div
        className="mt-3 flex items-end gap-1 tabular-nums text-gray-900 dark:text-neutral-100"
        style={{ fontFamily: "var(--font-clock), ui-monospace, monospace" }}
      >
        <span className="text-[40px] leading-none font-semibold tracking-tight">
          {clock?.hours ?? "--"}
        </span>
        <span className="text-[36px] leading-none font-semibold">:</span>
        <span className="text-[40px] leading-none font-semibold tracking-tight">
          {clock?.minutes ?? "--"}
        </span>
        <span
          className="mb-0.5 ml-1.5 font-mono text-[16px] leading-none font-medium tabular-nums text-gray-400 dark:text-neutral-500"
          style={{ fontFamily: "var(--font-dm-mono), ui-monospace, monospace" }}
        >
          {clock?.seconds ?? "--"}
        </span>
        <span className="mb-1 ml-1 text-[11px] leading-none font-medium tracking-wider text-gray-400 dark:text-neutral-500">
          {clock?.meridiem ?? ""}
        </span>
      </div>

      <p className={`mt-3 ${cardMetaClass}`}>
        {clock ? `${clock.weekday}, ${clock.date}` : " "}
      </p>
    </CardSurface>
  )
}
