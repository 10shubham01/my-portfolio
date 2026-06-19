"use client"

import { useState } from "react"
import { MousePointerClick } from "lucide-react"
import { cn } from "@/lib/utils"
import posthog from "posthog-js"

export const cardTitleClass =
  "font-geist text-[17px] font-medium tracking-tight text-gray-900 dark:text-neutral-100"

export const cardMetaClass = "font-mono text-[11px] text-gray-400 dark:text-neutral-500"

// Geometric corner-bracket frame: four short L-shaped ticks that sit just
// outside each corner so the boundary reads as an extended technical bracket
// (crop-mark style) instead of a filled badge. Reused by CardDate and the
// intro highlight so the whole canvas shares one framing language.
export function CornerFrame({
  children,
  className,
  as: Tag = "span",
}: {
  children: React.ReactNode
  className?: string
  as?: "span" | "div"
}) {
  const corner =
    "pointer-events-none absolute h-2 w-2 border-[#18A0FB]"
  return (
    <Tag className={cn("relative", className)}>
      <span aria-hidden className={cn(corner, "-top-[3px] -left-[3px] border-t border-l")} />
      <span aria-hidden className={cn(corner, "-top-[3px] -right-[3px] border-t border-r")} />
      <span aria-hidden className={cn(corner, "-bottom-[3px] -left-[3px] border-b border-l")} />
      <span aria-hidden className={cn(corner, "-right-[3px] -bottom-[3px] border-r border-b")} />
      {children}
    </Tag>
  )
}

export const cardDateClass =
  "font-mono text-[11px] font-medium tracking-wide text-gray-600 dark:text-neutral-300"

export function CardDate({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <CornerFrame className={cn("mx-1 inline-flex items-center px-1 py-0", cardDateClass, className)}>
      {children}
    </CornerFrame>
  )
}

export const cardBodyClass =
  "text-[14px] leading-relaxed text-gray-500 dark:text-neutral-400"

export const cardLinkClass =
  "shrink-0 font-mono text-xs text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-neutral-200"

export const visitLinkClass =
  "inline-flex shrink-0 items-center font-mono text-[11px] font-medium tracking-wide text-[#18A0FB] transition-colors hover:opacity-80"

// Guiding cursor that hovers over a CTA and taps at it on a loop, nudging the
// user to click. Render it as a sibling inside a `relative` wrapper around any
// clickable element; pass `className` to anchor it to the right corner.
export function CtaCursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "cta-cursor-hint pointer-events-none absolute text-[#18A0FB]",
        className ?? "-right-2 -bottom-3"
      )}
    >
      <span className="cta-cursor-ping absolute -top-1 -left-1 h-5 w-5 rounded-full border border-[#18A0FB]" />
      <MousePointerClick className="size-4 drop-shadow-sm" strokeWidth={2} />
    </span>
  )
}

export function VisitLink({
  href,
  label = "VISIT",
  className,
  onClick,
  trackingSource,
  trackingProps,
  hint = false,
}: {
  href: string
  label?: string
  className?: string
  onClick?: () => void
  trackingSource?: string
  trackingProps?: Record<string, string | number | boolean | null | undefined>
  /** When true, a guiding cursor hovers over the link until it is clicked. */
  hint?: boolean
}) {
  const [clicked, setClicked] = useState(false)
  const showHint = hint && !clicked

  return (
    <span className="relative inline-flex">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(visitLinkClass, className)}
        onClick={() => {
          setClicked(true)
          posthog.capture("link_clicked", {
            href,
            label: label.toLowerCase(),
            source: trackingSource ?? "unknown",
            ...trackingProps,
          })
          onClick?.()
        }}
      >
        [ {label} ]
      </a>

      {showHint && <CtaCursor />}
    </span>
  )
}

export const chromePanelClass =
  "border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"

// Shared card surface: hairline border.
export const cardSurfaceClass =
  "border border-gray-200/80 bg-white dark:border-neutral-700/60 dark:bg-neutral-900"

export function CardSurface({
  ref,
  interactive,
  className,
  children,
}: {
  ref?: React.RefObject<HTMLDivElement | null>
  interactive: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col p-6 sm:p-8",
        cardSurfaceClass,
        className
      )}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      {children}
    </div>
  )
}

export function CardSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="inline-flex items-center gap-2 font-mono text-sm font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
      <span
        aria-hidden
        className="h-3.5 w-[3px] shrink-0 rounded-full bg-[#18A0FB]"
      />
      {children}
    </h2>
  )
}

// Tech-stack chip. Plain monospace token wrapped in brand-blue brackets — no
// border or fill — so it matches the [ VISIT ] link language already on the
// cards. The brackets are dimmed by default and brighten with the label on
// hover.
export const cardChipClass =
  "group/chip inline-flex items-center gap-0.5 font-mono text-[10px] text-neutral-600 transition-colors hover:text-[#18A0FB] dark:text-neutral-300 dark:hover:text-[#18A0FB]"

const cardChipBracketClass =
  "text-[#18A0FB]/50 transition-colors group-hover/chip:text-[#18A0FB]"

export function CardChip({ children }: { children: React.ReactNode }) {
  return (
    <span className={cardChipClass}>
      <span aria-hidden className={cardChipBracketClass}>
        [
      </span>
      {children}
      <span aria-hidden className={cardChipBracketClass}>
        ]
      </span>
    </span>
  )
}

export function DashedRule({ className = "my-4" }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="1"
      className={cn("overflow-visible text-gray-200 dark:text-neutral-700", className)}
      shapeRendering="crispEdges"
    >
      <line
        x1="0"
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
