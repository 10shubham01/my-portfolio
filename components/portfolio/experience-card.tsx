"use client"

import { getExperienceById } from "@/lib/experience"
import {
  CardSectionTitle,
  CardSurface,
  CardDate,
  DashedRule,
  cardBodyClass,
  cardLinkClass,
  cardTitleClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export function ExperienceCard({
  workId,
  interactive,
  onResize,
}: {
  workId: string
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const entry = getExperienceById(workId)

  if (!entry) return null

  const content = (
    <WorkEntry entry={entry} linked={Boolean(entry.href)} />
  )

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <CardSectionTitle>{entry.company}</CardSectionTitle>
        <CardDate>{entry.period}</CardDate>
      </div>

      <div className="mt-5">
        {entry.href ? (
          <a
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </CardSurface>
  )
}

function WorkEntry({
  entry,
  linked = false,
}: {
  entry: NonNullable<ReturnType<typeof getExperienceById>>
  linked?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={cardTitleClass}>{entry.role}</h3>
          <p className="mt-0.5">
            <CardDate>{entry.period}</CardDate>
          </p>
        </div>
        {linked && <span className={cardLinkClass}>[ VISIT ]</span>}
      </div>

      <ul className="flex flex-col gap-2">
        {entry.highlights.map((highlight) => (
          <li key={highlight} className={`flex gap-2 ${cardBodyClass} text-[13px] leading-relaxed`}>
            <span className="shrink-0 font-mono text-gray-300 dark:text-neutral-600">–</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {entry.projects && entry.projects.length > 0 && (
        <>
          <DashedRule />
          <div className="flex flex-col gap-4">
            {entry.projects.map((project) => (
              <div key={project.title} className="flex flex-col gap-1.5">
                <p className="font-geist text-[14px] font-medium text-gray-800 dark:text-neutral-200">
                  {project.title}
                </p>
                <p className={`${cardBodyClass} text-[13px]`}>{project.description}</p>
                {project.stack && project.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {entry.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
