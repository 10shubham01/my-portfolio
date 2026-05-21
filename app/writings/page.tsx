import type { Metadata } from "next";
import { absoluteUrl, SITE_AUTHOR, SITE_TWITTER_HANDLE, siteImages } from "@/lib/site";
import { getWritingPreviews } from "@/lib/writings";
import { OrangeMidLine } from "@/components/orange-mid-line";
import { WritingsPageContent } from "./writings-page-content";

const description = `Notes by ${SITE_AUTHOR.name} on interface design, frontend craft, product work, and building smoother web experiences.`;

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
      <WritingsPageContent writings={writings} />

      <OrangeMidLine />
    </>
  );
}
