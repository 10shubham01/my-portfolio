import { aboutProseClass } from "@/components/about/about-section-panel";
import { ACHIEVEMENT_ENTRIES } from "@/lib/about-content";

export function AboutAchievementsParagraph() {
  const [soldier, strive] = ACHIEVEMENT_ENTRIES;

  return (
    <p className={aboutProseClass}>
      At Credilio, recognized with the <span className="text-[#FF5800]">{soldier.title}</span> (
      {soldier.year}) for {soldier.description}. The year before, the{" "}
      <span className="text-[#FF5800]">{strive.title}</span> ({strive.year}) for {strive.description}.
    </p>
  );
}
