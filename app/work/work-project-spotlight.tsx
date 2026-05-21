"use client";

import type { WorkProject } from "./work-project-types";
import { WorkProjectHeading } from "./work-project-heading";
import { WorkProjectVideoPlayer } from "./work-project-video-player";

type ExperienceHeading = {
  period: string;
  company: string;
  index: number;
};

type WorkProjectSpotlightProps = {
  projects: WorkProject[];
  activeIndex: number;
  openSignal?: number;
  showVideo?: boolean;
  experienceHeading?: ExperienceHeading | null;
};

export function WorkProjectSpotlight({
  projects,
  activeIndex,
  openSignal,
  showVideo = true,
  experienceHeading,
}: WorkProjectSpotlightProps) {
  if (projects.length === 0) return null;

  const currentProject = projects[Math.max(0, Math.min(activeIndex, projects.length - 1))];
  const showExperienceHeading = experienceHeading !== null && experienceHeading !== undefined;
  const headingLabel = showExperienceHeading
    ? `${experienceHeading.period} · ${experienceHeading.company}`
    : currentProject.spotlightLabel || currentProject.title.toUpperCase();
  const headingActiveIndex = showExperienceHeading ? experienceHeading.index : activeIndex;
  const spotlightGridClassName =
    "mx-auto grid h-full w-full max-w-3xl grid-cols-[minmax(0,8.25rem)_minmax(0,1fr)] items-end gap-3 px-4 pb-4 sm:grid-cols-[minmax(0,11rem)_1fr] sm:px-6 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-4 md:pb-5";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[90]"
      style={{
        top: "var(--site-nav-h, 0px)",
        height: "max(0px, calc(var(--about-fixed-line-top, 20vh) - var(--site-nav-h, 0px)))",
      }}
    >
      <div className="absolute inset-0 z-[100]">
        <div className={spotlightGridClassName}>
          <div
            className={`pointer-events-auto relative z-10 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showVideo ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {showVideo ? (
              <WorkProjectVideoPlayer video={currentProject.video} openSignal={openSignal} />
            ) : (
              <div className="w-full max-w-[12rem] self-end md:max-w-[13rem]" aria-hidden />
            )}
          </div>
          <div aria-hidden />
        </div>
      </div>

      <div className="absolute inset-0 z-[90]">
        <div className={spotlightGridClassName}>
          <div aria-hidden />
          <WorkProjectHeading activeIndex={headingActiveIndex} label={headingLabel} />
        </div>
      </div>
    </div>
  );
}
