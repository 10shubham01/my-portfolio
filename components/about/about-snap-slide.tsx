import { AboutAchievementsParagraph } from "@/components/about/about-achievements-paragraph";
import { AboutEducationParagraph } from "@/components/about/about-education-paragraph";
import { AboutProfileSection } from "@/components/about/about-profile-section";
import { AboutStackParagraph } from "@/components/about/about-stack-paragraph";
import { GithubCalendar } from "@/components/ui/github-calendar";
import type { AboutSnapSection } from "@/lib/about-snap-sections";

export function AboutSnapSlide({ section }: { section: AboutSnapSection }) {
  switch (section.kind) {
    case "profile":
      return <AboutProfileSection />;

    case "education":
      return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <AboutEducationParagraph />
        </div>
      );

    case "stack":
      return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <AboutStackParagraph />
        </div>
      );

    case "achievements":
      return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <AboutAchievementsParagraph />
        </div>
      );

    case "contributions":
      return (
        <div className="flex w-full min-w-0 max-w-full justify-center rounded-md px-0">
          <GithubCalendar
            className="w-full"
            username="10shubham01"
            colorSchema="orange"
            variant="default"
            showTotal
          />
        </div>
      );

    default:
      return null;
  }
}
