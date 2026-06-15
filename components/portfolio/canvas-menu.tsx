"use client"

import { Check, ChevronLeft, ChevronRight, Link } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { copyItemDeeplink } from "@/lib/canvas-deeplink"
import { getThemeNavItem, type NavGroup, type NavItem } from "@/lib/canvas-nav"
import { cn } from "@/lib/utils"

const rowClass =
  "flex w-full items-center gap-1 rounded px-1.5 py-1 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"

function NavItemRow({
  item,
  active,
  copied,
  onNavigateToItem,
  onCopyLink,
}: {
  item: NavItem
  active: boolean
  copied: boolean
  onNavigateToItem: (id: string) => void
  onCopyLink: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onNavigateToItem(item.id)}
        className={cn(rowClass, "min-w-0 flex-1")}
      >
        <span
          className={cn(
            "truncate font-mono text-[11px]",
            active ? "font-medium text-[#18A0FB]" : "text-gray-600 dark:text-neutral-300"
          )}
        >
          {item.label}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onCopyLink(item.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#18A0FB] dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-[#18A0FB]"
        aria-label={`Copy link to ${item.label}`}
        title="Copy link"
      >
        {copied ? <Check size={12} strokeWidth={2} /> : <Link size={12} strokeWidth={2} />}
      </button>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4h12M2 8h12M2 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const chromeButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-[color,box-shadow,border-color] hover:border-gray-300 hover:text-gray-900 hover:shadow dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-100"

const MENU_WIDTH = 220
const VIEWPORT_PADDING = 8

const shellClass =
  "w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg transition-[opacity,transform] duration-200 ease-out dark:border-neutral-700 dark:bg-neutral-900"

function clampMenuPosition(
  x: number,
  y: number,
  menuSize?: { width: number; height: number }
) {
  if (typeof window === "undefined") return { x, y }

  const menuWidth = menuSize?.width ?? MENU_WIDTH
  const menuHeight = menuSize?.height ?? 0

  const clampedX = Math.min(
    Math.max(x, VIEWPORT_PADDING),
    window.innerWidth - menuWidth - VIEWPORT_PADDING
  )

  let clampedY = Math.max(y, VIEWPORT_PADDING)

  if (menuHeight > 0) {
    const maxY = window.innerHeight - menuHeight - VIEWPORT_PADDING
    clampedY = Math.min(clampedY, Math.max(maxY, VIEWPORT_PADDING))
  } else {
    clampedY = Math.min(clampedY, window.innerHeight - VIEWPORT_PADDING)
  }

  return { x: clampedX, y: clampedY }
}

function CanvasMenuPanel({
  open,
  selectedId,
  groups,
  onNavigateToItem,
  onResetCanvas,
  className,
}: {
  open: boolean
  selectedId: string | null
  groups: NavGroup[]
  onNavigateToItem: (id: string) => void
  onResetCanvas?: () => void
  className?: string
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)

  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? null
  const inItemsView = activeGroup !== null
  const themeItem = getThemeNavItem()

  useEffect(() => {
    if (!open) setActiveGroupId(null)
  }, [open])

  async function handleCopyLink(id: string) {
    const ok = await copyItemDeeplink(id)
    if (!ok) return
    setCopiedId(id)
    window.setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current))
    }, 1500)
  }

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className={cn(
        shellClass,
        "flex max-h-[min(var(--menu-max-height),calc(100vh-16px))] flex-col overflow-hidden [--menu-max-height:320px]",
        open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
        className
      )}
    >
      {inItemsView ? (
        <>
          <div className="flex items-center gap-1 border-b border-gray-100 p-1.5 dark:border-neutral-800">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-gray-900 dark:text-neutral-100">
              {activeGroup.label}
            </span>
            <button
              type="button"
              onClick={() => setActiveGroupId(null)}
              className="flex shrink-0 items-center gap-1 rounded px-1 py-0.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              aria-label="Back to sections"
            >
              <span className="font-mono text-[10px]">{activeGroup.items.length}</span>
              <ChevronLeft size={12} strokeWidth={2} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            <div className="flex flex-col gap-0.5">
              {activeGroup.items.map((item) => (
                <NavItemRow
                  key={item.id}
                  item={item}
                  active={selectedId === item.id}
                  copied={copiedId === item.id}
                  onNavigateToItem={onNavigateToItem}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-1.5">
            <nav className="flex flex-col gap-0.5" aria-label="Canvas navigation">
              {groups.map((group) => {
                const hasActiveChild = group.items.some((item) => item.id === selectedId)

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    className={cn(
                      rowClass,
                      "justify-between font-mono text-[11px] text-gray-600 dark:text-neutral-300",
                      hasActiveChild && "text-[#18A0FB]"
                    )}
                  >
                    <span className="truncate">{group.label}</span>
                    <span className="flex shrink-0 items-center gap-1 text-gray-400 dark:text-neutral-500">
                      <span className="font-mono text-[10px]">{group.items.length}</span>
                      <ChevronRight size={12} strokeWidth={2} />
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-dashed border-gray-200 p-1.5 dark:border-neutral-700">
            {themeItem && (
              <NavItemRow
                item={themeItem}
                active={selectedId === themeItem.id}
                copied={copiedId === themeItem.id}
                onNavigateToItem={onNavigateToItem}
                onCopyLink={handleCopyLink}
              />
            )}
            <button
              type="button"
              onClick={() => onResetCanvas?.()}
              className={cn(
                "w-full rounded px-1.5 py-1 font-mono text-[10px] text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
                themeItem && "mt-1"
              )}
            >
              reset canvas
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function CanvasMenu({
  open,
  onOpenChange,
  anchor,
  selectedId,
  groups,
  onNavigateToItem,
  onResetCanvas,
}: {
  open: boolean
  onOpenChange: (open: boolean, source?: "button") => void
  anchor: { x: number; y: number } | null
  selectedId: string | null
  groups: NavGroup[]
  onNavigateToItem: (id: string) => void
  onResetCanvas?: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    if (!anchor || !open) {
      setAdjustedPosition(null)
      return
    }

    const panel = panelRef.current
    if (!panel) return

    const { width, height } = panel.getBoundingClientRect()
    setAdjustedPosition(clampMenuPosition(anchor.x, anchor.y, { width, height }))
  }, [anchor, open, groups, selectedId])

  const pointerPosition =
    adjustedPosition ?? (anchor ? clampMenuPosition(anchor.x, anchor.y) : null)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onPointerDown={() => onOpenChange(false)}
        />
      )}

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(!open, "button")}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={chromeButtonClass}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        {!anchor && (
          <CanvasMenuPanel
            open={open}
            selectedId={selectedId}
            groups={groups}
            onNavigateToItem={onNavigateToItem}
            onResetCanvas={onResetCanvas}
            className="origin-top-right"
          />
        )}
      </div>

      {anchor && pointerPosition && (
        <div
          ref={panelRef}
          className="fixed z-50"
          style={{ left: pointerPosition.x, top: pointerPosition.y }}
        >
          <CanvasMenuPanel
            open={open}
            selectedId={selectedId}
            groups={groups}
            onNavigateToItem={onNavigateToItem}
            onResetCanvas={onResetCanvas}
            className="origin-top-left"
          />
        </div>
      )}
    </>
  )
}
