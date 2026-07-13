"use client"

import { useEffect, useState } from "react"
import { NOW, formatUpdatedMonth, getNowFreshness, type NowFreshness } from "@/lib/now"
import { cn } from "@/lib/utils"
import {
  CardSectionTitle,
  CardSurface,
  CardDate,
  cardBodyClass,
  cardMetaClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export function NowCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  // Computed on the client so the relative label ("2 weeks ago") reflects the
  // visitor's current time. Until then we fall back to the absolute month,
  // which matches SSR output and avoids a hydration mismatch.
  const absolute = formatUpdatedMonth(NOW.updated)
  const [freshness, setFreshness] = useState<NowFreshness | null>(null)

  useEffect(() => {
    setFreshness(getNowFreshness(NOW.updated, new Date()))
  }, [])

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <CardSectionTitle>{NOW.heading}</CardSectionTitle>

      <ul className="mt-5 flex flex-col gap-2">
        {NOW.items.map((item) => (
          <li key={item} className={cardBodyClass}>
            {item}
          </li>
        ))}
      </ul>

      <p
        className={`mt-4 flex items-center ${cardMetaClass}`}
        title={`Last updated ${absolute}`}
      >
        {freshness ? (
          <span
            aria-hidden
            className={cn(
              "mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
              freshness.stale ? "bg-amber-500" : "bg-emerald-500"
            )}
          />
        ) : null}
        <span className="mr-1.5">Updated</span>
        <CardDate>{freshness ? freshness.label : absolute}</CardDate>
      </p>
    </CardSurface>
  )
}
