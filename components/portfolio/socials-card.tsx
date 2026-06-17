"use client"

import posthog from "posthog-js"
import { SOCIAL_LINKS } from "@/lib/canvas-data"
import {
  CardSectionTitle,
  CardSurface,
  VisitLink,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export function SocialsCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <CardSectionTitle>Socials</CardSectionTitle>

      <div className="mt-5 flex flex-col gap-4">
        {SOCIAL_LINKS.map(({ platform, handle, href }) => (
          <div key={platform} className="flex items-center justify-between gap-3 font-medium">
            <span className="font-mono text-[12px]">
              <span className="font-medium text-gray-600 dark:text-neutral-300">
                {platform}
              </span>
              <span className="text-gray-400 dark:text-neutral-500"> {handle}</span>
            </span>
            <VisitLink
              href={href}
              trackingSource="socials_card"
              trackingProps={{ platform }}
              onClick={() =>
                posthog.capture("social_link_visited", { platform, href })
              }
            />
          </div>
        ))}
      </div>
    </CardSurface>
  )
}
