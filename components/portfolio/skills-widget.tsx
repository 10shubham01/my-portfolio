"use client"

import { useEffect, useRef } from "react"
import { getSkillIconUrl, SKILLS } from "@/lib/skills"
import { cardSurfaceClass } from "@/components/portfolio/card-chrome"
import { cn } from "@/lib/utils"

export function SkillsWidget({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-5 p-6 sm:gap-6 sm:p-8",
        cardSurfaceClass
      )}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <h2 className="inline-flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        <span
          aria-hidden
          className="h-3.5 w-[3px] shrink-0 rounded-full bg-[#18A0FB]"
        />
        Skills
      </h2>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
        {SKILLS.map((skill) => (
          <li key={skill.name} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-2 transition-transform hover:scale-105 dark:border-neutral-700 dark:bg-neutral-800">
              <img
                src={getSkillIconUrl(skill)}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="text-xs leading-tight text-neutral-700 dark:text-neutral-300">{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
