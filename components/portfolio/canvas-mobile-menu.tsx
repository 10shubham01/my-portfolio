"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { Compass, Maximize2, MoonStar, Play, Share2, Sun, X } from "lucide-react"
import { buildCanvasNavGroups } from "@/lib/canvas-nav"
import { EMAIL, SOCIAL_LINKS } from "@/lib/canvas-data"
import { useTheme } from "@/components/portfolio/theme-provider"
import { cn } from "@/lib/utils"

type CanvasMobileMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedId: string | null
  onNavigate: (id: string) => void
  onFitAll: () => void
  onCopyView: () => void | Promise<unknown>
  onStartTour: () => void
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2 py-3 text-gray-700 transition-colors active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200 dark:active:bg-neutral-800"
    >
      <span className="text-gray-500 dark:text-neutral-400">{icon}</span>
      <span className="font-mono text-[10px] tracking-wide">{label}</span>
    </button>
  )
}

export function CanvasMobileMenu({
  open,
  onOpenChange,
  selectedId,
  onNavigate,
  onFitAll,
  onCopyView,
  onStartTour,
}: CanvasMobileMenuProps) {
  const { isDark, toggleTheme } = useTheme()
  const navGroups = buildCanvasNavGroups()

  // Keep the sheet mounted through its exit transition.
  const [render, setRender] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setRender(true)
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    setShown(false)
    const timer = window.setTimeout(() => setRender(false), 260)
    return () => window.clearTimeout(timer)
  }, [open])

  const close = () => onOpenChange(false)

  const run = (action: () => void) => {
    action()
    close()
  }

  if (!render) return null

  return (
    <div className="fixed inset-0 z-[300]" role="dialog" aria-modal aria-label="Menu">
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          shown ? "opacity-100" : "opacity-0"
        )}
        onPointerDown={close}
        aria-hidden
      />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[82vh] flex-col rounded-t-2xl border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-[260ms] ease-out dark:border-neutral-700 dark:bg-neutral-900",
          shown ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-4 pt-3 pb-2">
          <span className="font-mono text-[11px] font-medium tracking-widest text-gray-400 uppercase dark:text-neutral-500">
            Navigate
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors active:bg-gray-100 dark:text-neutral-500 dark:active:bg-neutral-800"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="canvas-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5">
          <div className="grid grid-cols-4 gap-2">
            <QuickAction
              icon={isDark ? <Sun size={16} /> : <MoonStar size={16} />}
              label={isDark ? "light" : "dark"}
              onClick={() => {
                posthog.capture("mobile_menu_action", { action: "toggle-theme" })
                toggleTheme()
              }}
            />
            <QuickAction
              icon={<Maximize2 size={16} />}
              label="fit all"
              onClick={() => {
                posthog.capture("mobile_menu_action", { action: "fit-all" })
                run(onFitAll)
              }}
            />
            <QuickAction
              icon={<Play size={16} />}
              label="tour"
              onClick={() => {
                posthog.capture("mobile_menu_action", { action: "start-tour" })
                run(onStartTour)
              }}
            />
            <QuickAction
              icon={<Share2 size={16} />}
              label="share"
              onClick={() => {
                posthog.capture("mobile_menu_action", { action: "copy-view" })
                run(() => void onCopyView())
              }}
            />
          </div>

          {navGroups.map((group) => (
            <div key={group.id} className="mt-5">
              <p className="px-1 pb-1 font-mono text-[10px] font-medium tracking-widest text-gray-400 uppercase dark:text-neutral-500">
                {group.label}
              </p>
              <div className="flex flex-col">
                {group.items.map((item) => {
                  const active = selectedId === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        posthog.capture("mobile_menu_navigate", { item_id: item.id })
                        run(() => onNavigate(item.id))
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 text-left transition-colors active:bg-gray-100 dark:active:bg-neutral-800",
                        active && "bg-gray-50 dark:bg-neutral-800/60"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[13px]",
                          active
                            ? "font-medium text-[#18A0FB]"
                            : "text-gray-700 dark:text-neutral-200"
                        )}
                      >
                        {item.label}
                      </span>
                      <Compass
                        size={14}
                        strokeWidth={2}
                        className={cn(
                          active ? "text-[#18A0FB]" : "text-gray-300 dark:text-neutral-600"
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="mt-5 border-t border-dashed border-gray-200 pt-3 dark:border-neutral-700">
            <p className="px-1 pb-1 font-mono text-[10px] font-medium tracking-widest text-gray-400 uppercase dark:text-neutral-500">
              Links
            </p>
            <div className="flex flex-wrap gap-2 px-1">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    posthog.capture("mobile_menu_link", { platform: link.platform })
                    close()
                  }}
                  className="rounded-full border border-gray-200 px-3 py-1.5 font-mono text-[11px] text-gray-600 transition-colors active:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:active:bg-neutral-800"
                >
                  {link.platform.toLowerCase()}
                </a>
              ))}
              <a
                href={`mailto:${EMAIL}`}
                onClick={close}
                className="rounded-full border border-gray-200 px-3 py-1.5 font-mono text-[11px] text-gray-600 transition-colors active:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:active:bg-neutral-800"
              >
                email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
