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
        "flex w-full flex-col bg-white p-6 sm:p-8 dark:bg-neutral-900",
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
    <h2 className="font-mono text-sm font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
      {children}
    </h2>
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
