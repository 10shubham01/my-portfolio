"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import posthog from "posthog-js"
import { getProjectById } from "@/lib/projects"
import {
  CardChip,
  CardSurface,
  CornerFrame,
  cardBodyClass,
  cardMetaClass,
  cardTitleClass,
  VisitLink,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

// Figma's own accent palette: red marks measurements, blue is selection
// (already used across the canvas via #18A0FB).
const FIGMA_RED = "#F24822"

// Figma's "frame" (#) layer glyph, used as the layer-type icon in the panel.
function FrameGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M4 1v10M8 1v10M1 4h10M1 8h10" />
    </svg>
  )
}

// Figma inspector-style section divider: a mono label with a hairline rule.
function InspectorLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase dark:text-neutral-500">
        {children}
      </span>
      <span className="h-px flex-1 bg-gray-100 dark:bg-neutral-800" />
    </div>
  )
}

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
      <div className="flex flex-col gap-4">
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
                {/* Figma layer name for the placed image */}
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

                {/* Figma red measurement annotation: distance line + dimension pill */}
                {dimensions && (
                  <div
                    className="mt-1 flex items-center gap-2"
                    style={{ color: FIGMA_RED }}
                  >
                    <span className="h-2 w-px bg-current" />
                    <span className="h-px flex-1 bg-current/40" />
                    <span
                      className="rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white"
                      style={{ backgroundColor: FIGMA_RED }}
                    >
                      {dimensions}
                    </span>
                    <span className="h-px flex-1 bg-current/40" />
                    <span className="h-2 w-px bg-current" />
                  </div>
                )}
              </figure>
            )
          })()}

        {/* Highlights rendered as a Figma layers panel */}
        <div className="overflow-hidden rounded-[4px] border border-gray-200 dark:border-neutral-700/70">
          <div className="flex items-center gap-1.5 border-b border-gray-100 px-2 py-1.5 dark:border-neutral-800">
            <ChevronDown size={12} strokeWidth={2} className="text-gray-400 dark:text-neutral-500" />
            <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase dark:text-neutral-500">
              Layers
            </span>
            <span className="ml-auto font-mono text-[10px] text-gray-300 dark:text-neutral-600">
              {project.highlights.length}
            </span>
          </div>
          <ul className="flex flex-col py-1">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="group/layer flex items-start gap-2 px-2 py-1 transition-colors hover:bg-[#18A0FB]/[0.06]"
              >
                <span className="flex h-[21px] shrink-0 items-center text-gray-300 transition-colors group-hover/layer:text-[#18A0FB] dark:text-neutral-600">
                  <FrameGlyph />
                </span>
                <span
                  className={`${cardBodyClass} text-[13px] leading-relaxed transition-colors group-hover/layer:text-gray-700 dark:group-hover/layer:text-neutral-200`}
                >
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stack as a Figma inspector section */}
        <div className="flex flex-col gap-2">
          <InspectorLabel>Stack</InspectorLabel>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <CardChip key={tech}>{tech}</CardChip>
            ))}
          </div>
        </div>
      </div>
    </CardSurface>
  )
}
