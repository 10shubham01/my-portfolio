"use client"

import { useCallback, useEffect, useRef } from "react"
import { Command } from "cmdk"
import { buildCanvasNavGroups } from "@/lib/canvas-nav"
import { CANVAS_ITEMS, EMAIL, SOCIAL_LINKS } from "@/lib/canvas-data"
import {
  CanvasOverlayPanel,
  canvasPanelGroupLabel,
  canvasPanelKbd,
  canvasPanelRow,
  canvasPanelRowActive,
  canvasPanelScroll,
} from "@/components/portfolio/canvas-overlay-panel"
import { Kbd } from "@/components/ui/kbd"
import { useTheme } from "@/components/portfolio/theme-provider"
import { cn } from "@/lib/utils"

type CanvasSpotlightProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (id: string) => void
  onFitAll: () => void
  onResetLayout: () => void
  onShowShortcuts: () => void
}

function SpotlightItem({
  value,
  keywords,
  label,
  hint,
  onSelect,
}: {
  value: string
  keywords?: string[]
  label: string
  hint?: string
  onSelect: () => void
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className={cn(canvasPanelRow, canvasPanelRowActive, "cursor-pointer justify-between")}
    >
      <span className="truncate">{label}</span>
      {hint ? (
        <Kbd className={canvasPanelKbd}>
          {hint}
        </Kbd>
      ) : null}
    </Command.Item>
  )
}

export function CanvasSpotlight({
  open,
  onOpenChange,
  onNavigate,
  onFitAll,
  onResetLayout,
  onShowShortcuts,
}: CanvasSpotlightProps) {
  const { theme, toggleTheme } = useTheme()
  const navGroups = buildCanvasNavGroups()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(timer)
  }, [open])

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const run = useCallback(
    (action: () => void) => {
      action()
      onOpenChange(false)
    },
    [onOpenChange]
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      window.alert(`Email: ${EMAIL}`)
    }
  }, [])

  return (
    <CanvasOverlayPanel
      open={open}
      onClose={close}
      ariaLabel="Search cards and actions"
      width={420}
    >
      <Command className="flex min-h-0 flex-1 flex-col" loop>
        <div className="border-b border-gray-100 px-3 py-2 dark:border-neutral-800">
          <Command.Input
            ref={inputRef}
            placeholder="search cards, actions, links…"
            className="w-full bg-transparent font-mono text-[12px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>

        <Command.List className={cn(canvasPanelScroll, "flex-1 p-1.5")}>
          <Command.Empty className="px-1.5 py-6 text-center font-mono text-[11px] text-gray-400 dark:text-neutral-500">
            no matches
          </Command.Empty>

          {navGroups.map((group) => (
            <Command.Group
              key={group.id}
              heading={group.label}
              className="[&_[cmdk-group-heading]]:hidden"
            >
              <p className={canvasPanelGroupLabel}>{group.label}</p>
              {group.items.map((item) => (
                <SpotlightItem
                  key={item.id}
                  value={`nav-${item.id}`}
                  keywords={[group.label, item.label]}
                  label={item.label}
                  onSelect={() => run(() => onNavigate(item.id))}
                />
              ))}
            </Command.Group>
          ))}

          <div className="my-1.5 border-t border-dashed border-gray-200 dark:border-neutral-700" />

          <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:hidden">
            <p className={canvasPanelGroupLabel}>Actions</p>
            <SpotlightItem
              value="action-toggle-theme"
              keywords={["theme", "dark", "light"]}
              label={`toggle ${theme === "dark" ? "light" : "dark"} mode`}
              hint="D"
              onSelect={() => run(toggleTheme)}
            />
            <SpotlightItem
              value="action-copy-email"
              keywords={["email", "contact"]}
              label="copy email"
              onSelect={() => run(() => void copyEmail())}
            />
            <SpotlightItem
              value="action-fit-all"
              keywords={["zoom", "fit"]}
              label="fit all cards"
              onSelect={() => run(onFitAll)}
            />
            <SpotlightItem
              value="action-reset-layout"
              keywords={["reset", "layout"]}
              label="reset canvas layout"
              hint="R"
              onSelect={() => run(onResetLayout)}
            />
            <SpotlightItem
              value="action-shortcuts"
              keywords={["keyboard", "shortcuts"]}
              label="keyboard shortcuts"
              hint="?"
              onSelect={() => run(onShowShortcuts)}
            />
          </Command.Group>

          <div className="my-1.5 border-t border-dashed border-gray-200 dark:border-neutral-700" />

          <Command.Group heading="Links" className="[&_[cmdk-group-heading]]:hidden">
            <p className={canvasPanelGroupLabel}>Links</p>
            {SOCIAL_LINKS.map((link) => (
              <SpotlightItem
                key={link.platform}
                value={`link-${link.platform.toLowerCase()}`}
                keywords={[link.platform, link.handle]}
                label={`${link.platform.toLowerCase()} ${link.handle.toLowerCase()}`}
                onSelect={() => {
                  window.open(link.href, "_blank", "noopener,noreferrer")
                  onOpenChange(false)
                }}
              />
            ))}
          </Command.Group>

          <Command.Group heading="Theme" className="[&_[cmdk-group-heading]]:hidden">
            <p className={canvasPanelGroupLabel}>Theme</p>
            <SpotlightItem
              value="nav-theme-doodle"
              keywords={["theme", "doodle"]}
              label="go to theme doodle"
              onSelect={() => {
                const themeItem = CANVAS_ITEMS.find((item) => item.type === "theme")
                if (themeItem) run(() => onNavigate(themeItem.id))
              }}
            />
          </Command.Group>
        </Command.List>
      </Command>
    </CanvasOverlayPanel>
  )
}
