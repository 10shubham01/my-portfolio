"use client"

import { ArrowUpRight, Check, Link, Maximize2 } from "lucide-react"
import posthog from "posthog-js"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CanvasItem } from "@/lib/canvas-config"
import { copyItemDeeplink } from "@/lib/canvas-deeplink"
import { getItemExternalUrl } from "@/lib/canvas-links"
import { cn } from "@/lib/utils"

const MENU_WIDTH = 220
const VIEWPORT_PADDING = 8

const rowClass =
  "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left font-mono text-[11px] whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#18A0FB] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#18A0FB]"

function RowHint({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto font-mono text-[10px] text-gray-400 dark:text-neutral-500">
      {children}
    </span>
  )
}

function Divider() {
  return <div className="my-1 h-px bg-gray-100 dark:bg-neutral-800" />
}

function clampToViewport(
  x: number,
  y: number,
  size: { width: number; height: number }
) {
  return {
    x: Math.min(
      Math.max(x, VIEWPORT_PADDING),
      window.innerWidth - size.width - VIEWPORT_PADDING
    ),
    y: Math.min(
      Math.max(y, VIEWPORT_PADDING),
      Math.max(window.innerHeight - size.height - VIEWPORT_PADDING, VIEWPORT_PADDING)
    ),
  }
}

function CardContextMenuPanel({
  item,
  anchor,
  onClose,
  onZoomToItem,
}: {
  item: CanvasItem
  anchor: { x: number; y: number }
  onClose: () => void
  onZoomToItem?: (id: string) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const externalUrl = getItemExternalUrl(item)

  useLayoutEffect(() => {
    if (!panelRef.current) return
    const { width, height } = panelRef.current.getBoundingClientRect()
    setPosition(clampToViewport(anchor.x, anchor.y, { width, height }))
  }, [anchor])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  const handleCopyLink = async () => {
    const ok = await copyItemDeeplink(item.id)
    if (!ok) return
    setCopied(true)
    posthog.capture("canvas_link_copied", {
      item_id: item.id,
      source: "card_context_menu",
    })
    window.setTimeout(onClose, 900)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onPointerDown={onClose}
        onContextMenu={(event) => {
          event.preventDefault()
          onClose()
        }}
      />

      <div
        ref={panelRef}
        className="fixed z-50 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        style={{
          width: MENU_WIDTH,
          left: position?.x ?? anchor.x,
          top: position?.y ?? anchor.y,
          visibility: position ? "visible" : "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="block truncate px-1.5 pt-0.5 pb-1 font-sans text-[10px] tracking-wide text-gray-400 select-none dark:text-neutral-500">
          {item.label}
        </span>

        <button type="button" onClick={handleCopyLink} className={rowClass}>
          {copied ? (
            <Check className="size-3 shrink-0" strokeWidth={2} />
          ) : (
            <Link className="size-3 shrink-0" strokeWidth={2} />
          )}
          {copied ? "Copied" : "Copy link to selection"}
        </button>

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(rowClass, "no-underline")}
            onClick={() => {
              posthog.capture("link_clicked", {
                href: externalUrl,
                label: "visit",
                source: "card_context_menu",
                item_id: item.id,
              })
              onClose()
            }}
          >
            <ArrowUpRight className="size-3 shrink-0" strokeWidth={2} />
            Visit
          </a>
        )}

        {onZoomToItem && (
          <>
            <Divider />
            <button
              type="button"
              className={rowClass}
              onClick={() => {
                onZoomToItem(item.id)
                onClose()
              }}
            >
              <Maximize2 className="size-3 shrink-0" strokeWidth={2} />
              Zoom to selection
              <RowHint>⇧2</RowHint>
            </button>
          </>
        )}
      </div>
    </>
  )
}

// Right-click menu for a single canvas card: "copy link" always, plus a
// "visit" row when the card resolves to one external destination (the socials
// card doesn't — it holds several links). Keyed by card and position so each
// open gets a fresh panel.
export function CardContextMenu({
  item,
  anchor,
  onClose,
  onZoomToItem,
}: {
  item: CanvasItem | null
  anchor: { x: number; y: number } | null
  onClose: () => void
  onZoomToItem?: (id: string) => void
}) {
  if (!item || !anchor) return null

  return (
    <CardContextMenuPanel
      key={`${item.id}-${anchor.x}-${anchor.y}`}
      item={item}
      anchor={anchor}
      onClose={onClose}
      onZoomToItem={onZoomToItem}
    />
  )
}
