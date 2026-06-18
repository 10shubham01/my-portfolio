import { cn } from "@/lib/utils"
import posthog from "posthog-js"

export const cardTitleClass =
  "font-geist text-[17px] font-medium tracking-tight text-gray-900 dark:text-neutral-100"

export const cardMetaClass = "font-mono text-[11px] text-gray-400 dark:text-neutral-500"

export const cardDateClass =
  "rounded bg-[#18A0FB]/10 px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-[#18A0FB]"

export function CardDate({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn(cardDateClass, className)}>{children}</span>
}

export const cardBodyClass =
  "text-[14px] leading-relaxed text-gray-500 dark:text-neutral-400"

export const cardLinkClass =
  "shrink-0 font-mono text-xs text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-neutral-200"

export const visitLinkClass =
  "inline-flex shrink-0 items-center font-mono text-[11px] font-medium tracking-wide text-[#18A0FB] transition-colors hover:opacity-80"

export function VisitLink({
  href,
  label = "VISIT",
  className,
  onClick,
  trackingSource,
  trackingProps,
}: {
  href: string
  label?: string
  className?: string
  onClick?: () => void
  trackingSource?: string
  trackingProps?: Record<string, string | number | boolean | null | undefined>
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(visitLinkClass, className)}
      onClick={() => {
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
  )
}

export const chromePanelClass =
  "rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"

// Shared "tactile frame" surface: hairline border, rounded corners and a soft
// layered shadow so each card reads as a tangible object on the canvas instead
// of a flat white block. Keep this radius in sync with the selection outline
// radius in canvas-frame.tsx (12px = rounded-xl).
export const cardSurfaceClass =
  "rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_-1px_rgba(16,24,40,0.10),0_8px_24px_-8px_rgba(16,24,40,0.14)] dark:border-neutral-700/60 dark:bg-neutral-900 dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.6)]"

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

// Refined "pill" chip used for tech stacks. Centralized so every card shares
// the same look and picks up the brand-blue hover accent.
export const cardChipClass =
  "rounded-full border border-gray-200/80 bg-gray-50 px-2.5 py-0.5 font-mono text-[10px] text-neutral-600 transition-colors hover:border-[#18A0FB]/40 hover:text-[#18A0FB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-[#18A0FB]/50 dark:hover:text-[#18A0FB]"

export function CardChip({ children }: { children: React.ReactNode }) {
  return <span className={cardChipClass}>{children}</span>
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
