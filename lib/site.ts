import { SOCIAL_LINKS } from "./social-links";

export const SITE_NAME = "Shubham Gupta";
export const SITE_TITLE = "Shubham Gupta | Portfolio";
export const SITE_DESCRIPTION =
  "Portfolio and writing by Shubham Gupta, a web developer building expressive, fast, and polished web experiences.";
export const SITE_KEYWORDS = [
  "Shubham Gupta",
  "Shubham portfolio",
  "Shubham developer",
  "Shubham web developer",
  "portfolio",
  "frontend developer",
  "web experiences",
];

export const SITE_TWITTER_HANDLE = "@10shubham01";

export const SITE_AUTHOR = {
  name: "Shubham Gupta",
  location: "Mumbai, India",
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin],
};

export const SITE_URL = "https://shubhamgupta.dev";

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  return envUrl.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export const siteImages = {
  logo: "/images/logo/logo.png",
  og: "/images/logo/og-image.png",
  icon: "/icon.png",
  appleIcon: "/apple-icon.png",
};
