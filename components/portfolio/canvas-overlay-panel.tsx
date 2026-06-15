"use client"

import { useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export const canvasPanelShell =
  "rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"

export const canvasPanelRow =
  "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left font-mono text-[11px] text-gray-600 transition-colors hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"

export const canvasPanelRowActive =
  "aria-selected:bg-gray-50 aria-selected:font-medium aria-selected:text-[#18A0FB] dark:aria-selected:bg-neutral-800"

export const canvasPanelGroupLabel =
  "px-1.5 pt-2 pb-0.5 font-mono text-[10px] font-medium tracking-widest text-gray-400 uppercase dark:text-neutral-500"

export const canvasPanelKey =
  "shrink-0 font-mono text-[10px] text-gray-400 dark:text-neutral-500"

export const canvasPanelScroll = "canvas-scrollbar min-h-0 overflow-y-auto"

export const canvasPanelKbd =
  "h-5 min-w-5 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"

export function CanvasOverlayPanel({
  open,
  onClose,
  title,
  description,
  ariaLabel,
  children,
  className,
  width = 400,
}: {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  ariaLabel?: string
  children: ReactNode
  className?: string
  width?: number
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[300] bg-black/10 dark:bg-black/30"
        onPointerDown={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal
        aria-label={ariaLabel ?? title ?? "Dialog"}
        className={cn(
          "fixed top-[16%] left-1/2 z-[301] flex max-h-[min(72vh,560px)] -translate-x-1/2 flex-col overflow-hidden",
          canvasPanelShell,
          "origin-top transition-[opacity,transform] duration-200 ease-out",
          className
        )}
        style={{ width: `min(calc(100vw - 2rem), ${width}px)` }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {title || description ? (
          <div className="border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
            {title ? (
              <h2 className="font-mono text-[11px] font-medium tracking-widest text-gray-400 uppercase dark:text-neutral-500">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "font-sans text-[13px] leading-relaxed text-gray-500 dark:text-neutral-400",
                  title && "mt-1"
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}
      </div>
    </>
  )
}
