"use client"

import { useState } from "react"
import { Heart, MessageCircle } from "lucide-react"
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

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 4h9M2.5 7h9M2.5 10h9"
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

// Figma's measurement blue — the same primary accent the tour and contact
// slip use.
const controlClass =
  "flex h-8 items-center justify-center rounded-md text-[#18A0FB] transition-colors hover:bg-[#18A0FB]/10"

function ZoomMenuRow({
  label,
  hint,
  disabled = false,
  onSelect,
}: {
  label: string
  hint?: string
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center rounded px-1.5 py-1 text-left font-mono text-[11px] whitespace-nowrap transition-colors",
        disabled
          ? "text-gray-300 dark:text-neutral-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#18A0FB] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#18A0FB]"
      )}
    >
      {label}
      {hint && (
        <span className="ml-auto pl-4 font-mono text-[10px] text-gray-400 dark:text-neutral-500">
          {hint}
        </span>
      )}
    </button>
  )
}

export function CanvasZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomTo,
  onFitAll,
  onZoomToSelection,
  hasSelection = false,
  onOpenSpotlight,
  onLike,
  onMessage,
  liked = false,
  isMobile = false,
}: {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onZoomTo?: (zoom: number) => void
  onFitAll: () => void
  onZoomToSelection?: () => void
  hasSelection?: boolean
  onOpenSpotlight?: () => void
  onLike?: () => void
  onMessage?: () => void
  liked?: boolean
  isMobile?: boolean
}) {
  const label = `${Math.round(zoom * 100)}%`
  const [menuOpen, setMenuOpen] = useState(false)

  const runAndClose = (action: () => void) => () => {
    action()
    setMenuOpen(false)
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      onPointerDown={(event) => event.stopPropagation()}
    >
      {menuOpen && (
        <div className="fixed inset-0" onPointerDown={() => setMenuOpen(false)} />
      )}

      {onLike && (
        <button
          type="button"
          aria-label={liked ? "You loved this portfolio" : "Love this portfolio"}
          aria-pressed={liked}
          title={liked ? "You loved this portfolio" : "Love this portfolio"}
          className={cn(
            controlClass,
            "w-8 hover:text-red-500",
            liked && "text-red-500"
          )}
          onClick={onLike}
        >
          <Heart
            size={14}
            strokeWidth={2}
            className={cn(liked && "fill-red-500")}
          />
        </button>
      )}

      {onMessage && (
        <button
          type="button"
          aria-label="Send Shubham a message"
          title="Say hi"
          className={cn(controlClass, "w-8")}
          onClick={onMessage}
        >
          <MessageCircle size={14} strokeWidth={2} />
        </button>
      )}

      {(onLike || onMessage) && (
        <div className="mx-0.5 h-5 w-px bg-gray-200 dark:bg-neutral-700" />
      )}

      <button
        type="button"
        aria-label="Zoom out"
        className={cn(controlClass, "w-8")}
        onClick={onZoomOut}
      >
        <ZoomOutIcon />
      </button>

      <div className="relative">
        <button
          type="button"
          aria-label="Zoom options"
          aria-expanded={menuOpen}
          className={cn(
            controlClass,
            "min-w-[52px] px-2 font-mono text-[11px]",
            menuOpen && "bg-[#18A0FB]/10"
          )}
          onClick={() => (isMobile ? onZoomReset() : setMenuOpen((open) => !open))}
        >
          {label}
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-1/2 mb-2 w-[188px] -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            <ZoomMenuRow label="Zoom in" onSelect={runAndClose(onZoomIn)} />
            <ZoomMenuRow label="Zoom out" onSelect={runAndClose(onZoomOut)} />
            <div className="my-1 h-px bg-gray-100 dark:bg-neutral-800" />
            <ZoomMenuRow label="Zoom to fit" hint="⇧1" onSelect={runAndClose(onFitAll)} />
            {onZoomToSelection && (
              <ZoomMenuRow
                label="Zoom to selection"
                hint="⇧2"
                disabled={!hasSelection}
                onSelect={runAndClose(onZoomToSelection)}
              />
            )}
            <div className="my-1 h-px bg-gray-100 dark:bg-neutral-800" />
            {onZoomTo && (
              <ZoomMenuRow label="Zoom to 50%" onSelect={runAndClose(() => onZoomTo(0.5))} />
            )}
            <ZoomMenuRow label="Zoom to 100%" hint="⌘0" onSelect={runAndClose(onZoomReset)} />
            {onZoomTo && (
              <ZoomMenuRow label="Zoom to 200%" onSelect={runAndClose(() => onZoomTo(2))} />
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="Zoom in"
        className={cn(controlClass, "w-8")}
        onClick={onZoomIn}
      >
        <ZoomInIcon />
      </button>

      <div className="mx-0.5 h-5 w-px bg-gray-200 dark:bg-neutral-700" />

      {onOpenSpotlight ? (
        <>
          <button
            type="button"
            aria-label={isMobile ? "Open menu" : "Open spotlight"}
            title={isMobile ? "Menu" : "Spotlight (⌘K)"}
            className={cn(
              controlClass,
              isMobile ? "w-8" : "min-w-[52px] px-2 font-mono text-[11px]"
            )}
            onClick={onOpenSpotlight}
          >
            {isMobile ? <MenuIcon /> : "⌘K"}
          </button>
          <div className="mx-0.5 h-5 w-px bg-gray-200 dark:bg-neutral-700" />
        </>
      ) : null}

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
