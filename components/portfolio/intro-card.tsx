"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { SITE } from "@/lib/canvas-data"
import { SayHiButton } from "@/components/portfolio/say-hi-button"
import { CardSurface, CardDate, CornerFrame } from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

// Career start: August 2022. Computed live so the intro always reflects the
// current tenure without manual edits.
const CAREER_START = new Date(2021, 7, 1) // month is 0-indexed: 7 = August

function formatExperience(from: Date, to: Date) {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  if (to.getDate() < from.getDate()) months -= 1
  const years = Math.floor(months / 12)
  const remMonths = months % 12

  const parts: string[] = []
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`)
  if (remMonths > 0) parts.push(`${remMonths} month${remMonths === 1 ? "" : "s"}`)
  return parts.join(" ") || "0 months"
}

function ExternalLink({
  href,
  linkLabel,
  children,
}: {
  href: string
  linkLabel: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
      onClick={() =>
        posthog.capture("intro_link_visited", {
          link_label: linkLabel,
          href,
        })
      }
    >
      {children}
    </a>
  )
}

export function IntroCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const experience = formatExperience(CAREER_START, new Date())

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <div className="flex flex-col items-start gap-4">
        <Image
          src="/assets/images/waving.gif"
          alt=""
          width={64}
          height={86}
          unoptimized
          className="mb-1 h-auto w-16 [image-rendering:pixelated]"
          aria-hidden
        />

        <p className="font-sans text-xs tracking-[0.28em] text-gray-400 uppercase dark:text-neutral-500">
          {SITE.location} · {SITE.age}
        </p>

        <h1 className="font-geist text-[32px] leading-tight font-medium tracking-tight text-gray-900 dark:text-neutral-100">
          {SITE.name}
        </h1>

        <CornerFrame
          as="div"
          className="my-1 block w-full px-2.5 py-1.5 text-[15px] leading-relaxed text-gray-700 dark:text-neutral-200"
        >
          <span className="font-medium text-gray-900 dark:text-neutral-100">
            {experience}
          </span>{" "}
          of professional engineering experience — and counting.
        </CornerFrame>

        <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-500 dark:text-neutral-400">
          <p>
            {SITE.title} at{" "}
            <ExternalLink href="https://www.webmd.com" linkLabel="webmd">
              WebMD
            </ExternalLink>
            .
            Previously senior engineer at{" "}
            <ExternalLink
              href="https://www.novio.in/"
              linkLabel="novio_work_history"
            >
              novio
            </ExternalLink>
            .
          </p>
          <p>
            Six years designing, building, and operating production web
            applications — from UI and component libraries to APIs, data stores,
            and AWS infrastructure.
          </p>
          <p>
            Currently working on internal health-tech tooling at WebMD. Deep
            experience in regulated fintech: credit and lending journeys,
            platform architecture, and engineering mentorship.
          </p>
          <p>
            Recognized with the True Soldier Award <CardDate>2025</CardDate> and Strive for
            Excellence Award <CardDate>2024</CardDate> at novio. BCA from Lovely Professional
            University <CardDate>2018–2021</CardDate>.
          </p>
          <p>
            {SITE.tagline} <SayHiButton />
          </p>
        </div>
      </div>
    </CardSurface>
  )
}
