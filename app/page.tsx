import type { Metadata } from "next";
import { AlienText } from "@/components/alien-text";
import { HeroText } from "@/components/hero-text";
import { HomeSocialLinks } from "@/components/home-social-links";
import { WavyDoodles } from "@/components/wavy-doodles";
import { getLocationAgeEyebrow } from "@/lib/birthday";
import { basteleur } from "@/lib/fonts";
import {
  absoluteUrl,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_JOB_TITLE,
  SITE_ORGANIZATION,
  SITE_TITLE,
  SITE_TWITTER_HANDLE,
  siteImages,
} from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "profile",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: `${SITE_AUTHOR.name} — ${SITE_JOB_TITLE} at ${SITE_ORGANIZATION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [siteImages.og],
    creator: SITE_TWITTER_HANDLE,
  },
};

export default function HomePage() {
  const locationEyebrow = getLocationAgeEyebrow();

  return (
    <section className="social-hover-focus mx-auto flex min-h-[68dvh] w-full max-w-xl flex-col items-center justify-center gap-4 px-3 text-center sm:px-4">
      <h1 className="sr-only">
        {SITE_AUTHOR.name} — {SITE_JOB_TITLE} at {SITE_ORGANIZATION}
      </h1>
      <WavyDoodles className="mb-1" size={64} />
      <p className="font-sans font-light text-xs uppercase select-none tracking-[0.28em] text-muted-foreground">
        <span className="sr-only">{locationEyebrow}</span>
        <AlienText text={locationEyebrow} syncHeroTiming />
      </p>
      <div className="hero-title relative z-10 w-full max-w-[min(100%,36rem)] overflow-visible selection:bg-[#FF5800] selection:text-white">
        <HeroText
          text="Yo, I'm Shubham and I build web experiences."
          className={`${basteleur.className} text-3xl font-bold uppercase leading-[1.12] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-5xl md:leading-[1.05] lg:text-6xl`}
        />
      </div>
      <HomeSocialLinks />
    </section>
  );
}
