"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

const RESUME_URL = "/shubham-gupta.pdf"

export function ResumeCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  return (
    <div
      ref={ref}
      className="flex w-full items-center justify-center"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <a
        href={RESUME_URL}
        download
        aria-label="Download resume"
        title="Download resume"
        className="inline-flex"
        onClick={() =>
          posthog.capture("link_clicked", {
            href: RESUME_URL,
            label: "download resume",
            source: "resume-icon",
          })
        }
      >
        <Image
          src="/assets/images/resume-icon.png"
          alt="Resume"
          width={338}
          height={334}
          className="h-auto w-full max-w-[200px] select-none"
          draggable={false}
          loading="lazy"
          sizes="200px"
        />
      </a>
    </div>
  )
}
