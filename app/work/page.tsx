import type { Metadata } from "next";
import { absoluteUrl, SITE_AUTHOR, SITE_TWITTER_HANDLE, siteImages } from "@/lib/site";
import { WorkPageContent } from "./work-page-content";
import { WorkOrangeLine } from "./work-orange-line";
import { WorkViewportMask } from "./work-viewport-mask";
import { WORK_PROJECTS } from "./work-projects";

const description = `Experience and selected projects by ${SITE_AUTHOR.name} — fintech platforms, full-stack delivery, and personal builds.`;

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: {
    canonical: absoluteUrl("/work"),
  },
  openGraph: {
    title: `Work by ${SITE_AUTHOR.name}`,
    description,
    url: "/work",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: `Work by ${SITE_AUTHOR.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Work by ${SITE_AUTHOR.name}`,
    description,
    images: [siteImages.og],
    creator: SITE_TWITTER_HANDLE,
  },
};

export default function WorkPage() {
  const isScrollable = WORK_PROJECTS.length > 5;

  return (
    <>
      <WorkPageContent projects={WORK_PROJECTS} isScrollable={isScrollable} />
      <WorkViewportMask />
      <WorkOrangeLine />
    </>
  );
}
