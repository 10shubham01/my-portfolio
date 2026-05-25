import type { Metadata } from "next";
import { absoluteUrl, SITE_AUTHOR, SITE_TWITTER_HANDLE, siteImages } from "@/lib/site";
import { DEV_UTILS, DEV_UTILS_REPO } from "@/lib/dev-utils-data";
import { getWritingPreviews } from "@/lib/writings";
import { OrangeMidLine } from "@/components/orange-mid-line";
import { PageViewportMask } from "@/components/page-viewport-mask";
import { WritingsPageContent } from "./writings-page-content";

const description = `Writings by ${SITE_AUTHOR.name}, software engineer at WebMD — frontend craft, product work, dev utilities, and building polished web experiences.`;

export const metadata: Metadata = {
  title: "Writings",
  description,
  alternates: {
    canonical: absoluteUrl("/writings"),
  },
  openGraph: {
    title: `Writings by ${SITE_AUTHOR.name}`,
    description,
    url: "/writings",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: `Writings by ${SITE_AUTHOR.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Writings by ${SITE_AUTHOR.name}`,
    description,
    images: [siteImages.og],
    creator: SITE_TWITTER_HANDLE,
  },
};

export default function WritingsPage() {
  const writings = getWritingPreviews();

  return (
    <>
      <WritingsPageContent writings={writings} utils={DEV_UTILS} utilsRepoUrl={DEV_UTILS_REPO} />
      <PageViewportMask />
      <OrangeMidLine />
    </>
  );
}
