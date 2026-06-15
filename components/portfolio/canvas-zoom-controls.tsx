"use client"

import { cn } from "@/lib/utils"

function ZoomOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 3v8M3 7h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 5V2.5H5M9 2.5H11.5V5M11.5 9v2.5H9M5 11.5H2.5V9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const controlClass =
  "flex h-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"

export function CanvasZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitAll,
}: {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onFitAll: () => void
}) {
  const label = `${Math.round(zoom * 100)}%`

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Zoom out"
        className={cn(controlClass, "w-8")}
        onClick={onZoomOut}
      >
        <ZoomOutIcon />
      </button>

      <button
        type="button"
        aria-label="Reset zoom to 100%"
        className={cn(controlClass, "min-w-[52px] px-2 font-mono text-[11px]")}
        onClick={onZoomReset}
      >
        {label}
      </button>

      <button
        type="button"
        aria-label="Zoom in"
        className={cn(controlClass, "w-8")}
        onClick={onZoomIn}
      >
        <ZoomInIcon />
      </button>

      <div className="mx-0.5 h-5 w-px bg-gray-200 dark:bg-neutral-700" />

      <button
        type="button"
        aria-label="Fit all frames"
        title="Fit all"
        className={cn(controlClass, "w-8")}
        onClick={onFitAll}
      >
        <FitIcon />
      </button>
    </div>
  )
}
