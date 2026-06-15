"use client"

import { AWARDS } from "@/lib/awards"
import {
  CardSectionTitle,
  CardSurface,
  CardDate,
  DashedRule,
  cardBodyClass,
  cardMetaClass,
  cardTitleClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export function AwardsCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <CardSectionTitle>Awards</CardSectionTitle>

      <div className="mt-5 flex flex-col gap-6">
        {AWARDS.map((award, index) => (
          <div key={award.title}>
            {index > 0 && <DashedRule className="mb-6" />}

            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className={cardTitleClass}>{award.title}</h3>
                <CardDate className="shrink-0">{award.year}</CardDate>
              </div>

              <p className={cardMetaClass}>{award.organization}</p>

              <p className={cardBodyClass}>{award.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardSurface>
  )
}
