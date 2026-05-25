import type { Metadata } from "next";
import {
  absoluteUrl,
  SITE_AUTHOR,
  SITE_JOB_TITLE,
  SITE_ORGANIZATION,
  SITE_TWITTER_HANDLE,
  siteImages,
} from "@/lib/site";
import { AboutPageContent } from "./about-page-content";

const description = `About ${SITE_AUTHOR.name} — ${SITE_JOB_TITLE} at ${SITE_ORGANIZATION} in Mumbai. Six years building production web apps with React, Next.js, Vue, TypeScript, and AWS. Previously Credilio Financial Technologies.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: `About ${SITE_AUTHOR.name}`,
    description,
    url: "/about",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: `About ${SITE_AUTHOR.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_AUTHOR.name}`,
    description,
    images: [siteImages.og],
    creator: SITE_TWITTER_HANDLE,
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
