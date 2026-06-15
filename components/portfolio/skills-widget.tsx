"use client"

import { useEffect, useRef } from "react"
import { getSkillIconUrl, SKILLS } from "@/lib/skills"

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
      className="flex w-full flex-col gap-5 bg-white p-6 sm:gap-6 sm:p-8"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <h2 className="font-mono text-sm font-medium uppercase tracking-widest text-neutral-500">
        Skills
      </h2>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
        {SKILLS.map((skill) => (
          <li key={skill.name} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-2 transition-transform hover:scale-105">
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
            <span className="text-xs leading-tight text-neutral-700">{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
