import { aboutProseClass } from "@/components/about/about-section-panel";
import { ABOUT_EDUCATION } from "@/lib/about-content";

export function AboutEducationParagraph() {
  return (
    <p className={aboutProseClass}>
      Graduated <span className="text-[#FF5800]">{ABOUT_EDUCATION.period}</span> from{" "}
      <span className="text-[#FF5800]">{ABOUT_EDUCATION.school}</span> with a{" "}
      {ABOUT_EDUCATION.degree} — {ABOUT_EDUCATION.coursework}.
    </p>
  );
}
