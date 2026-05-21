import {
  AboutSectionPanel,
  aboutBodyClass,
  aboutCardClass,
  aboutMetaClass,
} from "@/components/about/about-section-panel";
import { AlienText } from "@/components/alien-text";
import { ABOUT_EDUCATION, ACHIEVEMENT_ENTRIES } from "@/lib/about-content";

export function AboutAchievementsSection() {
  return (
    <AboutSectionPanel>
      <ul className="space-y-3">
        {ACHIEVEMENT_ENTRIES.map((award) => (
          <li key={award.title}>
            <article className={aboutCardClass}>
              <p className={aboutMetaClass}>{award.year}</p>
              <h3
                aria-label={award.title}
                className="mt-1 font-sans text-base font-bold text-foreground md:text-lg"
              >
                <AlienText text={award.title} />
              </h3>
              <p className="font-oblique text-sm text-muted-foreground">{award.org}</p>
              <p className={`${aboutBodyClass} mt-2 text-sm md:text-[15px]`}>{award.description}</p>
            </article>
          </li>
        ))}
      </ul>

      <article className={`${aboutCardClass} mt-4`}>
        <p className={aboutMetaClass}>Education</p>
        <h3
          aria-label={ABOUT_EDUCATION.degree}
          className="mt-1 font-sans text-base font-bold text-foreground md:text-lg"
        >
          <AlienText text={ABOUT_EDUCATION.degree} />
        </h3>
        <p className="font-oblique text-sm text-muted-foreground">{ABOUT_EDUCATION.school}</p>
        <p className="mt-1 font-sans text-xs font-light uppercase tracking-[0.16em] text-muted-foreground/70">
          {ABOUT_EDUCATION.period}
        </p>
        <p className={`${aboutBodyClass} mt-2 text-sm md:text-[15px]`}>
          {ABOUT_EDUCATION.coursework}
        </p>
      </article>
    </AboutSectionPanel>
  );
}
