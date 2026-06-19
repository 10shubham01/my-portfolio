"use client"

import { useState } from "react"
import posthog from "posthog-js"
import {
  CardSectionTitle,
  CardSurface,
  CtaCursor,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

const PEERLIST_PROJECT_URL =
  "https://peerlist.io/10shubham01/project/shubhams-portfolio"

export function PeerlistCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const [clicked, setClicked] = useState(false)

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <CardSectionTitle>Featured</CardSectionTitle>

      <a
        href={PEERLIST_PROJECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-3 inline-flex w-fit transition-opacity hover:opacity-80"
        onClick={() => {
          setClicked(true)
          posthog.capture("link_clicked", {
            href: PEERLIST_PROJECT_URL,
            label: "peerlist project of the week",
            source: "peerlist-card",
          })
        }}
      >
        {/* Theme-aware badge: light variant by default, dark variant when the
            `dark` class is on <html>. */}
        <img
          src="https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-two-light.svg"
          alt="Peerlist Project of the Week — Rank #2"
          className="block h-16 w-auto dark:hidden"
        />
        <img
          src="https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-two-dark.svg"
          alt="Peerlist Project of the Week — Rank #2"
          className="hidden h-16 w-auto dark:block"
        />
        {interactive && !clicked && <CtaCursor className="right-1 bottom-1" />}
      </a>
    </CardSurface>
  )
}
