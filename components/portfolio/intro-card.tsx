"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { SITE, SOCIAL_LINKS } from "@/lib/canvas-data"
import { SayHiButton } from "@/components/portfolio/say-hi-button"

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onResize || !ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      onResize(
        box ? box.inlineSize : entry.contentRect.width,
        box ? box.blockSize : entry.contentRect.height
      )
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onResize])

  return (
    <div
      ref={ref}
      className="flex w-full flex-col gap-8 bg-white p-6 sm:gap-10 sm:p-8"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
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

        <p className="font-sans text-xs tracking-[0.28em] text-gray-400 uppercase">
          {SITE.location} · {SITE.age}
        </p>

        <h1 className="font-geist text-[32px] leading-tight font-medium tracking-tight text-gray-900">
          {SITE.name}
        </h1>

        <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-500">
          <p>
            {SITE.title} at{" "}
            <ExternalLink href="https://www.webmd.com">WebMD</ExternalLink>.
            Previously senior engineer at{" "}
            <ExternalLink href="https://www.shubhamgupta.dev/work">
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
            Recognized with the True Soldier Award (2025) and Strive for
            Excellence Award (2024) at Credilio. BCA from Lovely Professional
            University (2018–2021).
          </p>
          <p>
            {SITE.tagline} <SayHiButton />
          </p>
        </div>
      </div>

      <svg width="100%" height="1" className="overflow-visible" shapeRendering="crispEdges">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="flex flex-col gap-4">
        {SOCIAL_LINKS.map(({ platform, handle, href }) => (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between font-medium"
          >
            <span className="font-mono text-[12px]">
              <span className="font-medium text-gray-600">{platform}</span>
              <span className="text-gray-400"> {handle}</span>
            </span>
            <span className="font-mono text-xs text-gray-400 transition-colors group-hover:text-gray-800">
              [ VISIT ]
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
