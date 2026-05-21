"use client";

import { useCallback, useState } from "react";

import { EXPERIENCE_ENTRIES } from "@/lib/about-content";
import { WorkExperienceAccordion } from "./work-experience-accordion";
import { WorkProjectList } from "./work-project-list";
import { WorkProjectSpotlight } from "./work-project-spotlight";
import type { WorkProject } from "./work-project-types";

const FIRST_EXPERIENCE_COMPANY = EXPERIENCE_ENTRIES[0]?.company ?? null;

type WorkPageContentProps = {
  projects: WorkProject[];
  isScrollable: boolean;
};

export function WorkPageContent({ projects, isScrollable }: WorkPageContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeExperienceCompany, setActiveExperienceCompany] = useState(FIRST_EXPERIENCE_COMPANY);
  const [showProjectVideo, setShowProjectVideo] = useState(false);
  const [videoOpenSignal, setVideoOpenSignal] = useState(0);
  const maxIndex = Math.max(0, projects.length - 1);
  const safeActiveIndex = projects.length === 0 ? -1 : Math.max(0, Math.min(activeIndex, maxIndex));
  const activeExperience =
    activeExperienceCompany === null
      ? null
      : (EXPERIENCE_ENTRIES.find((job) => job.company === activeExperienceCompany) ?? null);
  const activeExperienceIndex =
    activeExperience === null
      ? -1
      : EXPERIENCE_ENTRIES.findIndex((job) => job.company === activeExperience.company);

  const handleExperienceChange = useCallback((company: string | null) => {
    setShowProjectVideo(false);
    setActiveExperienceCompany(company ?? FIRST_EXPERIENCE_COMPANY);
  }, []);

  const handleActiveIndexChange = useCallback(
    (nextIndex: number) => {
      if (projects.length === 0) return;
      setShowProjectVideo(true);
      setActiveIndex(Math.max(0, Math.min(nextIndex, maxIndex)));
    },
    [maxIndex, projects.length],
  );

  const handleProjectOpen = useCallback(() => {
    setVideoOpenSignal((current) => current + 1);
  }, []);

  return (
    <>
      <WorkProjectSpotlight
        projects={projects}
        activeIndex={safeActiveIndex}
        openSignal={videoOpenSignal}
        showVideo={showProjectVideo}
        experienceHeading={
          !showProjectVideo && activeExperience
            ? {
                period: activeExperience.period,
                company: activeExperience.company,
                index: activeExperienceIndex,
              }
            : null
        }
      />

      <section
        className={`hide-scrollbar relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 ${isScrollable ? "h-dvh overflow-y-auto" : "h-auto overflow-visible"}`}
        style={{ paddingTop: "calc(var(--about-fixed-line-top, 20vh) + 6px)" }}
      >
        <h1 className="sr-only">Work</h1>

        <div className="mx-auto w-full max-w-(--writing-content-width) space-y-10">
          <WorkExperienceAccordion
            onActiveJobChange={handleExperienceChange}
            onSectionMouseEnter={() => setShowProjectVideo(false)}
          />

          <div onMouseEnter={() => setShowProjectVideo(true)}>
            <p className="mb-3 font-sans text-[10px] font-light uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]">
              Personal projects
            </p>
            <WorkProjectList
              projects={projects}
              activeIndex={safeActiveIndex}
              onActiveIndexChange={handleActiveIndexChange}
              onProjectOpen={handleProjectOpen}
            />
          </div>
        </div>
      </section>
    </>
  );
}
