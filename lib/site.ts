import { SOCIAL_LINKS, X_USERNAME } from "./social-links";

export const SITE_NAME = "Shubham Gupta";

/** Primary browser tab / search result title */
export const SITE_TITLE = "Shubham Gupta | Software Engineer @ WebMD";

export const SITE_JOB_TITLE = "Senior Software Engineer";

export const SITE_ORGANIZATION = "WebMD";

export const SITE_DESCRIPTION =
  "Shubham Gupta — senior software engineer at WebMD in Mumbai, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development. Previously senior engineer at Credilio Financial Technologies.";

export const SITE_KEYWORDS = [
  "Shubham Gupta",
  "Shubham Gupta WebMD",
  "Shubham Gupta software engineer",
  "Shubham Gupta developer",
  "Shubham Gupta Mumbai",
  "Shubham Gupta portfolio",
  "Shubham Gupta Credilio",
  "software engineer WebMD",
  "senior software engineer Mumbai",
  "full stack developer India",
  "React developer Mumbai",
  "Next.js developer",
  "web developer portfolio",
];

export const SITE_TWITTER_HANDLE = `@${X_USERNAME}`;

export const SITE_AUTHOR = {
  name: "Shubham Gupta",
  givenName: "Shubham",
  familyName: "Gupta",
  location: "Mumbai, India",
  jobTitle: SITE_JOB_TITLE,
  worksFor: SITE_ORGANIZATION,
  sameAs: [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.peerlist,
    SOCIAL_LINKS.instagram,
  ],
};

export const SITE_URL = "https://shubhamgupta.dev";

/** Google Search Console — HTML tag method */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
  "-Ui1kS-nua4A61bgc_LWJl8PK0YFjtJqzzo1bukv9S0";

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

export function getWebsiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TITLE,
    url,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url,
    },
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url,
    },
  };
}

export function getPersonJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}/#person`,
    name: SITE_AUTHOR.name,
    givenName: SITE_AUTHOR.givenName,
    familyName: SITE_AUTHOR.familyName,
    url,
    image: absoluteUrl(siteImages.logo),
    description: SITE_DESCRIPTION,
    jobTitle: SITE_AUTHOR.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: SITE_ORGANIZATION,
    },
    homeLocation: {
      "@type": "Place",
      name: SITE_AUTHOR.location,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Development",
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "Node.js",
      "AWS",
    ],
    sameAs: SITE_AUTHOR.sameAs,
  };
}

export function getProfilePageJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: SITE_TITLE,
    url,
    description: SITE_DESCRIPTION,
    mainEntity: { "@id": `${url}/#person` },
    isPartOf: { "@type": "WebSite", url, name: SITE_NAME },
  };
}
