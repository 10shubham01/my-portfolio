"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  CanvasOverlayPanel,
  canvasPanelGroupLabel,
  canvasPanelKbd,
  canvasPanelScroll,
} from "@/components/portfolio/canvas-overlay-panel"
import { PORTFOLIO_SHORTCUTS } from "@/lib/portfolio-shortcuts"
import { cn } from "@/lib/utils"

const GROUP_ORDER = ["Navigation", "Canvas", "View", "Actions", "Hidden"] as const

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <CanvasOverlayPanel
      open={open}
      onClose={() => onOpenChange(false)}
      title="Shortcuts"
      description="Pan, zoom, and navigate without leaving the board."
      width={380}
    >
      <div className={cn(canvasPanelScroll, "flex-1 p-3")}>
        {GROUP_ORDER.map((group, groupIndex) => {
          const entries = PORTFOLIO_SHORTCUTS.filter((entry) => entry.group === group)
          if (!entries.length) return null

          return (
            <section key={group} className={groupIndex > 0 ? "mt-4" : undefined}>
              <h3 className={canvasPanelGroupLabel}>{group}</h3>
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {entries.map((entry) => (
                  <li
                    key={`${entry.keys.join("+")}-${entry.label}`}
                    className="flex items-center justify-between gap-4 rounded px-1.5 py-1"
                  >
                    <span className="font-mono text-[11px] text-gray-600 dark:text-neutral-300">
                      {entry.label}
                    </span>
                    <KbdGroup>
                      {entry.keys.map((key) => (
                        <Kbd key={key} className={canvasPanelKbd}>
                          {key}
                        </Kbd>
                      ))}
                    </KbdGroup>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </CanvasOverlayPanel>
  )
}
