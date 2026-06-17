"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { SITE } from "@/lib/canvas-data"
import { SayHiButton } from "@/components/portfolio/say-hi-button"
import { CardSurface, CardDate } from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

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

        <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-500 dark:text-neutral-400">
          <p>
            {SITE.title} at{" "}
            <ExternalLink href="https://www.webmd.com" linkLabel="webmd">
              WebMD
            </ExternalLink>
            .
            Previously senior engineer at{" "}
            <ExternalLink
              href="https://www.shubhamgupta.dev/work"
              linkLabel="credilio_work_history"
            >
              Credilio Financial Technologies
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
            Recognized with the True Soldier Award (<CardDate>2025</CardDate>) and Strive for
            Excellence Award (<CardDate>2024</CardDate>) at Credilio. BCA from Lovely Professional
            University (<CardDate>2018–2021</CardDate>).
          </p>
          <p>
            {SITE.tagline} <SayHiButton />
          </p>
        </div>
      </div>
    </CardSurface>
  )
}
