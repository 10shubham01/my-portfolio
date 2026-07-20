"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
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
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
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

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Figma's measurement blue — the same primary accent the contact slip and
// selection frames use.
const tourBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#18A0FB] transition-all hover:bg-[#18A0FB]/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"

export function CanvasTour({
  active,
  caption,
  step,
  total,
  onPrev,
  onNext,
  onExit,
}: {
  active: boolean
  caption: string
  step: number
  total: number
  onPrev: () => void
  onNext: () => void
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
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        onPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, onExit, onPrev, onNext])

  if (!active) return null

  const isLast = step >= total - 1

  return (
    <div
      className="fixed top-4 left-1/2 z-[200] flex w-[min(calc(100vw-2rem),440px)] -translate-x-1/2 items-center gap-2 px-2 py-1"
      onPointerDown={(event) => event.stopPropagation()}
      role="dialog"
      aria-label="Guided tour"
    >
      <button
        type="button"
        className={tourBtn}
        onClick={onPrev}
        disabled={step === 0}
        aria-label="Previous"
      >
        <ArrowLeftIcon />
      </button>

      <p className="flex-1 text-center font-sans text-[13px] leading-snug text-gray-700 dark:text-neutral-200">
        {caption}
      </p>

      <button
        type="button"
        className={tourBtn}
        onClick={onNext}
        aria-label={isLast ? "Finish" : "Next"}
      >
        <ArrowRightIcon />
      </button>

      <button type="button" className={tourBtn} onClick={onExit} aria-label="Exit tour">
        <CloseIcon />
      </button>
    </div>
  )
}
