"use client"

import { NOW } from "@/lib/now"
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

      <p className={`mt-4 ${cardMetaClass}`}>
        Updated <CardDate>{NOW.updated}</CardDate>
      </p>
    </CardSurface>
  )
}
