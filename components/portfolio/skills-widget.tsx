"use client"

import { Fragment, useEffect, useRef } from "react"
import { getSkillGroups, getSkillIconUrl } from "@/lib/skills"
import { cn } from "@/lib/utils"

export function SkillsWidget({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const groups = getSkillGroups()

  useEffect(() => {
    if (!onResize || !ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      onResize(
        box ? box.inlineSize : entry.contentRect.width,
        box ? box.blockSize : entry.contentRect.height
      )
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onResize])

  // A FigJam-style flow graph: each category is a node on the board and its
  // skills are smaller nodes threaded onto a dashed connector. No card surface
  // — the frame's own "skills" label titles it, so it reads as canvas content.
  return (
    <div
      ref={ref}
      className="flex w-full flex-col gap-6"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      {groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-3.5">
          {/* category node + label + connector line out to the edge */}
          <header className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#18A0FB]"
            />
            <span className="shrink-0 font-mono text-[10px] font-medium tracking-widest text-gray-500 uppercase dark:text-neutral-400">
              {group.label}
            </span>
            <span
              aria-hidden
              className="h-px flex-1 border-t border-dashed border-gray-300/70 dark:border-neutral-600/60"
            />
            <span className="shrink-0 font-mono text-[10px] text-gray-400 dark:text-neutral-500">
              {String(group.skills.length).padStart(2, "0")}
            </span>
          </header>

          {/* skill nodes threaded on connectors */}
          <div className="flex flex-wrap items-center gap-y-4 pl-[3px]">
            {group.skills.map((skill, index) => (
              <Fragment key={skill.name}>
                {index > 0 ? (
                  <span
                    aria-hidden
                    className="h-px w-3 shrink-0 border-t border-dashed border-gray-300/70 dark:border-neutral-600/60"
                  />
                ) : null}

                <span
                  title={skill.name}
                  className="group/skill relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200/70 bg-white/60 transition-colors hover:z-10 group-hover/skill:bg-white dark:border-neutral-700/50 dark:bg-neutral-900/50"
                >
                  <img
                    src={getSkillIconUrl(skill)}
                    alt={skill.name}
                    width={26}
                    height={26}
                    className={cn(
                      "h-[26px] w-[26px] object-contain",
                      skill.invertDark && "dark:invert"
                    )}
                    loading="lazy"
                    decoding="async"
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-md border border-dashed border-[#18A0FB] opacity-0 transition-opacity group-hover/skill:opacity-100"
                  />

                  {/* hover label — Figma-style name tag, sits above the canvas */}
                  <span className="pointer-events-none absolute top-full left-1/2 z-20 mt-1.5 -translate-x-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-gray-600 opacity-0 shadow-sm transition-opacity group-hover/skill:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {skill.name}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
