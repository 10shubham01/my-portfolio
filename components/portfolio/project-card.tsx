"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { getProjectById } from "@/lib/projects"
import {
  CardChip,
  CardSectionTitle,
  CardSurface,
  CornerFrame,
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
          <VisitLink
            href={project.href}
            hint={interactive}
            trackingSource="project_card"
            trackingProps={{ project_id: projectId, project_name: project.name }}
            onClick={() =>
              posthog.capture("project_link_visited", {
                project_id: projectId,
                project_name: project.name,
                href: project.href,
              })
            }
          />
        </div>

        <p className={`${cardBodyClass} text-[13px]`}>{project.description}</p>

        {project.media &&
          (() => {
            const aspect = project.mediaAspect ?? "1002/682"
            const fileName = project.media.split("/").pop()
            const [w, h] = aspect.split("/")
            const dimensions = w && h ? `${w} × ${h}` : null

            return (
              <figure className="my-1 flex flex-col gap-1.5">
                {/* Figma-style frame label */}
                <figcaption className="font-mono text-[10px] tracking-wide text-gray-400 dark:text-neutral-500">
                  {fileName}
                </figcaption>

                {/* Brand-blue crop-mark brackets framing the media */}
                <CornerFrame as="div" className="block w-full">
                  <div
                    className="relative w-full overflow-hidden bg-gray-50 dark:bg-neutral-900/60"
                    style={{ aspectRatio: aspect }}
                  >
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
                </CornerFrame>

                {/* Blueprint dimension annotation */}
                {dimensions && (
                  <figcaption className="self-end font-mono text-[10px] text-gray-300 dark:text-neutral-600">
                    {dimensions}
                  </figcaption>
                )}
              </figure>
            )
          })()}

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
            <CardChip key={tech}>{tech}</CardChip>
          ))}
        </div>
      </div>
    </CardSurface>
  )
}
