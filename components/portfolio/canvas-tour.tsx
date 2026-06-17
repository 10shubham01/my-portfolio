"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8.5 3 4.5 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5.5 3 9.5 7l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const tourBtn =
  "flex h-7 items-center justify-center gap-1 rounded-md px-2 font-mono text-[11px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"

export function CanvasTour({
  active,
  caption,
  step,
  total,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onExit,
}: {
  active: boolean
  caption: string
  step: number
  total: number
  playing: boolean
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
  onExit: () => void
}) {
  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = document.activeElement?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (event.key === "Escape") {
        event.preventDefault()
        onExit()
      } else if (event.key === " ") {
        event.preventDefault()
        onTogglePlay()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, onExit, onTogglePlay])

  if (!active) return null

  const isLast = step >= total - 1

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[200] flex w-[min(calc(100vw-2rem),440px)] -translate-x-1/2 flex-col gap-2 rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95"
      onPointerDown={(event) => event.stopPropagation()}
      role="dialog"
      aria-label="Guided tour"
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 rounded bg-[#18A0FB]/10 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-widest text-[#18A0FB] uppercase">
          Tour
        </span>
        <p className="flex-1 font-sans text-[13px] leading-snug text-gray-700 dark:text-neutral-200">
          {caption}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1" aria-hidden>
          {Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1 rounded-full transition-all",
                index === step
                  ? "w-4 bg-[#18A0FB]"
                  : "w-1 bg-gray-300 dark:bg-neutral-600"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <button type="button" className={tourBtn} onClick={onPrev} disabled={step === 0} aria-label="Previous">
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className={cn(tourBtn, "min-w-[44px]")}
            onClick={onTogglePlay}
            aria-label={playing ? "Pause tour" : "Play tour"}
          >
            {playing ? "pause" : "play"}
          </button>
          <button type="button" className={tourBtn} onClick={onNext} aria-label={isLast ? "Finish" : "Next"}>
            {isLast ? "done" : <ArrowRightIcon />}
          </button>
          <div className="mx-0.5 h-4 w-px bg-gray-200 dark:bg-neutral-700" />
          <button type="button" className={tourBtn} onClick={onExit} aria-label="Exit tour">
            exit
          </button>
        </div>
      </div>
    </div>
  )
}
