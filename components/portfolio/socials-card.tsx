"use client"

import { SOCIAL_LINKS } from "@/lib/canvas-data"
import { CardSectionTitle, CardSurface } from "@/components/portfolio/card-chrome"
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
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between font-medium"
          >
            <span className="font-mono text-[12px]">
              <span className="font-medium text-gray-600 dark:text-neutral-300">
                {platform}
              </span>
              <span className="text-gray-400 dark:text-neutral-500"> {handle}</span>
            </span>
            <span className="font-mono text-xs text-gray-400 transition-colors group-hover:text-gray-800 dark:text-neutral-500 dark:group-hover:text-neutral-200">
              [ VISIT ]
            </span>
          </a>
        ))}
      </div>
    </CardSurface>
  )
}
