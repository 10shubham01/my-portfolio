"use client"

import Image from "next/image"
import { getProjectById } from "@/lib/projects"
import {
  CardSectionTitle,
  CardSurface,
  cardBodyClass,
  cardMetaClass,
  cardTitleClass,
  VisitLink,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

export function ProjectCard({
  projectId,
  interactive,
  onResize,
}: {
  projectId: string
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const project = getProjectById(projectId)

  if (!project) return null

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <CardSectionTitle>Project</CardSectionTitle>
        <span className={cardMetaClass}>Open source</span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={cardTitleClass}>{project.name}</h3>
            <p className={`mt-0.5 ${cardMetaClass}`}>{project.tagline}</p>
          </div>
          <VisitLink href={project.href} />
        </div>

        <p className={`${cardBodyClass} text-[13px]`}>{project.description}</p>

        {project.media && (
          <div className="relative aspect-[1002/682] w-full overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-700">
            <Image
              src={project.media}
              alt={project.mediaAlt || `${project.name} demo`}
              fill
              unoptimized={project.media.endsWith(".gif")}
              sizes="400px"
              className="object-cover"
              draggable={false}
            />
          </div>
        )}

        <ul className="flex flex-col gap-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className={`flex gap-2 ${cardBodyClass} text-[13px] leading-relaxed`}
            >
              <span className="shrink-0 font-mono text-gray-300 dark:text-neutral-600">–</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </CardSurface>
  )
}
