"use client";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import { AccordionPanel } from "@/components/accordion-panel";
import { TechChips } from "@/components/about/stack-icon-token";
import { aboutBodyClass, aboutBulletClass, aboutMetaClass } from "@/components/about/about-section-panel";
import type { ExperienceEntry, ProjectEntry } from "@/lib/about-content";
import { EXPERIENCE_ENTRIES } from "@/lib/about-content";

const rowClass =
  "group flex min-h-11 w-full cursor-pointer select-none items-center gap-1.5 rounded-xl border px-1 py-0.5 text-left text-[16px] leading-6 transition-[background-color,border-color,color,box-shadow] duration-200";

function activeRowClass(isActive: boolean) {
  return isActive
    ? "border-foreground/12 bg-foreground/7 text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/10 dark:shadow-none"
    : "border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5 hover:text-foreground dark:hover:border-white/8 dark:hover:bg-white/5";
}

function KeyProjectPanel({ project }: { project: ProjectEntry }) {
  return (
    <div className="border-t border-dotted border-foreground/12 px-3 pb-3 pt-2.5 dark:border-white/12">
      <p className={`${aboutBodyClass} text-sm md:text-[15px]`}>{project.summary}</p>
      <p className="mt-2 text-sm font-bold leading-snug text-foreground/75 md:text-[15px]">
        <span className="text-muted-foreground/80">Role — </span>
        {project.role}
      </p>
      <p className="mt-1.5 text-sm font-bold leading-snug text-foreground/75 md:text-[15px]">
        <span className="text-muted-foreground/80">Impact — </span>
        {project.impact}
      </p>
      <TechChips ids={project.techStack} />
    </div>
  );
}

function KeyProjectRow({
  project,
  isOpen,
  onToggle,
}: {
  project: ProjectEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="overflow-hidden rounded-lg border border-foreground/8 dark:border-white/8">
      <button
        type="button"
        className={`${rowClass} ${activeRowClass(isOpen)} min-h-9 text-[15px]`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <p className="min-w-0 shrink pl-2.5 truncate whitespace-nowrap leading-6">
          <span className="font-medium text-foreground/90">{project.name}</span>
        </p>
        <span className="h-px min-w-16 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
        <CaretDownIcon
          size={16}
          className={`mr-2 shrink-0 text-foreground/45 transition-transform duration-300 ease-(--expo-out) ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <AccordionPanel open={isOpen}>
        <KeyProjectPanel project={project} />
      </AccordionPanel>
    </li>
  );
}

function ExperienceJobPanel({ job }: { job: ExperienceEntry }) {
  const [openProject, setOpenProject] = useState<string | null>(
    job.projects?.[0]?.name ?? null,
  );

  return (
    <div className="space-y-2 border-t border-dotted border-foreground/12 px-2 pb-3 pt-2 dark:border-white/12">
      <p className="px-0.5 text-sm font-medium text-foreground/90 md:text-[15px]">{job.company}</p>
      <ul className={aboutBulletClass}>
        {job.highlights.map((item) => (
          <li key={item} className="list-none before:mr-1.5 before:content-['–']">
            {item}
          </li>
        ))}
      </ul>

      {job.projects && job.projects.length > 0 ? (
        <div className="space-y-1.5">
          <p className={`${aboutMetaClass} px-0.5`}>Key projects</p>
          <ul className="space-y-1">
            {job.projects.map((project) => (
              <KeyProjectRow
                key={project.name}
                project={project}
                isOpen={openProject === project.name}
                onToggle={() =>
                  setOpenProject((current) => (current === project.name ? null : project.name))
                }
              />
            ))}
          </ul>
        </div>
      ) : null}

      <TechChips ids={job.techStack} />
    </div>
  );
}

function ExperienceJobRow({
  job,
  isOpen,
  onToggle,
  onMouseEnter,
}: {
  job: ExperienceEntry;
  isOpen: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <li className="overflow-hidden rounded-xl">
      <button
        type="button"
        className={`${rowClass} ${activeRowClass(isOpen)}`}
        aria-expanded={isOpen}
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
      >
        <p className="min-w-0 shrink pl-2.5 leading-6">
          <span className="block truncate font-medium text-foreground/90">{job.period}</span>
          <span className="block truncate text-[13px] text-foreground/45">
            {job.role}
            <span className="hidden md:inline"> · {job.company}</span>
          </span>
        </p>
        <span className="h-px min-w-12 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
        <CaretDownIcon
          size={16}
          className={`mr-2 shrink-0 text-foreground/45 transition-transform duration-300 ease-(--expo-out) ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <AccordionPanel open={isOpen}>
        <ExperienceJobPanel job={job} />
      </AccordionPanel>
    </li>
  );
}

type WorkExperienceAccordionProps = {
  onActiveJobChange?: (company: string | null) => void;
  onSectionMouseEnter?: () => void;
};

export function WorkExperienceAccordion({
  onActiveJobChange,
  onSectionMouseEnter,
}: WorkExperienceAccordionProps) {
  const [openJob, setOpenJob] = useState<string | null>(EXPERIENCE_ENTRIES[0]?.company ?? null);

  return (
    <div
      className="w-full"
      onMouseEnter={onSectionMouseEnter}
      onMouseLeave={() => onActiveJobChange?.(null)}
    >
      <p className="mb-3 font-sans text-[10px] font-light uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]">
        Experience
      </p>
      <ul className="space-y-0.5" aria-label="Experience">
        {EXPERIENCE_ENTRIES.map((job) => (
          <ExperienceJobRow
            key={job.company}
            job={job}
            isOpen={openJob === job.company}
            onToggle={() => setOpenJob((current) => (current === job.company ? null : job.company))}
            onMouseEnter={() => onActiveJobChange?.(job.company)}
          />
        ))}
      </ul>
    </div>
  );
}
