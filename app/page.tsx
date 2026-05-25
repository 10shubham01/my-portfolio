import type { Metadata } from "next";
import { HeroText } from "@/components/hero-text";
import { CVLogoIcon, Github, Instagram, Linkedin, PeerlistSolid } from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import { getLocationAgeEyebrow } from "@/lib/birthday";
import { basteleur } from "@/lib/fonts";
import { SOCIAL_LINKS } from "@/lib/social-links";
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

type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin, external: true },
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: Github, external: true },
  { href: SOCIAL_LINKS.peerlist, label: "Peerlist", Icon: PeerlistSolid, external: true },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: Instagram, external: true },
  { href: SOCIAL_LINKS.resume, label: "Resume", Icon: CVLogoIcon, external: true },
  { href: SOCIAL_LINKS.email, label: "Get in touch", text: "GET IN TOUCH", external: true },
] as const satisfies ReadonlyArray<
  | { href: string; label: string; Icon: SocialIcon; external: boolean }
  | { href: string; label: string; text: string; external: boolean }
>;

export default function HomePage() {
  return (
    <section className="social-hover-focus mx-auto flex min-h-[68dvh] w-full max-w-xl flex-col items-center justify-center gap-4 px-3 text-center sm:px-4">
      <h1 className="sr-only">
        {SITE_AUTHOR.name} — {SITE_JOB_TITLE} at {SITE_ORGANIZATION}
      </h1>
      <p className="font-sans font-light text-xs uppercase select-none tracking-[0.28em] text-muted-foreground">
        {getLocationAgeEyebrow()}
      </p>
      <div className="hero-title relative z-10 w-full max-w-[min(100%,36rem)] overflow-visible selection:bg-[#FF5800] selection:text-white">
        <HeroText
          text="Yo, I'm Shubham and I build web experiences."
          className={`${basteleur.className} text-3xl font-bold uppercase leading-[1.12] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-5xl md:leading-[1.05] lg:text-6xl`}
        />
      </div>
      <div className="social-links relative z-20 font-sans font-light flex max-w-md flex-wrap items-center justify-center gap-3 text-muted-foreground md:gap-5">
        {SOCIAL_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={item.label}
            className={`${basteleur.className} inline-flex origin-center cursor-pointer items-center gap-0.5 rounded-sm text-xl font-bold transition-transform duration-300 ease-out hover:scale-[1.5] focus-visible:scale-[1.5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
          >
            <span aria-hidden="true">[</span>
            {"text" in item ? (
              <span className="shrink-0 text-sm tracking-wide sm:text-base" aria-hidden>
                {item.text}
              </span>
            ) : (
              <item.Icon className="size-5 shrink-0" aria-hidden />
            )}
            <span aria-hidden="true">]</span>
          </a>
        ))}
      </div>
    </section>
  );
}
