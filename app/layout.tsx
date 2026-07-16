import type { Metadata } from "next"
import { DM_Mono, Geist, Inter, Allura } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/canvas-data"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
})

// Thin, flowing signature script for the contact slip's "Signed" line.
const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
  // Only used on the offscreen contact slip's "Signed" line — don't preload it
  // into <head> and compete with above-the-fold resources.
  preload: false,
})

// Local display serif used for the big draggable "Fullstack Developer" tagline.
const basteleur = localFont({
  src: [
    { path: "./fonts/Basteleur-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/Basteleur-Moonlight.otf", weight: "300", style: "normal" },
  ],
  variable: "--font-basteleur",
})

// Local Helvetica Neue family.
const helveticaNeue = localFont({
  src: [
    { path: "./fonts/HelveticaNeueRoman.otf", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNeueLight.otf", weight: "300", style: "normal" },
    { path: "./fonts/Helvetica-Oblique.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-helvetica",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Shubham Gupta — Software Engineer @ WebMD",
  description:
    "Shubham Gupta — senior software engineer at WebMD, based in Mumbai, India. I build fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript. Previously at novio.",
  authors: [{ name: "Shubham Gupta", url: "https://shubhamgupta.dev" }],
  keywords: [
    "Shubham Gupta",
    "Shubham Gupta WebMD",
    "Shubham Gupta software engineer",
    "Shubham Gupta Mumbai",
    "Shubham Gupta portfolio",
    "Shubham Gupta novio",
    "software engineer WebMD",
    "senior software engineer Mumbai",
    "full stack developer India",
    "React developer Mumbai",
    "Next.js developer",
  ],
  openGraph: {
    title: "Shubham Gupta — Software Engineer @ WebMD",
    description:
      "Shubham Gupta — senior software engineer at WebMD, based in Mumbai, India. I build fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript.",
    url: "https://shubhamgupta.dev",
    siteName: "Shubham Gupta",
    type: "profile",
    images: [`${SITE.url}/og`],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@10shubham01",
    title: "Shubham Gupta — Software Engineer @ WebMD",
    description:
      "Shubham Gupta — senior software engineer at WebMD, based in Mumbai, India. I build fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript.",
    images: [`${SITE.url}/og`],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://shubhamgupta.dev/#person",
  name: "Shubham Gupta",
  givenName: "Shubham",
  familyName: "Gupta",
  url: "https://shubhamgupta.dev",
  image: `${SITE.url}/og`,
  description:
    "Shubham Gupta — senior software engineer at WebMD, based in Mumbai, India. I build fast, thoughtful web experiences with React, Next.js, Vue, and TypeScript. Previously at novio.",
  jobTitle: "Senior Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "WebMD",
  },
  homeLocation: {
    "@type": "Place",
    name: "Mumbai, India",
  },
  sameAs: [
    "https://github.com/10shubham01",
    "https://www.linkedin.com/in/10shubham01/",
    "https://peerlist.io/10shubham01",
    "https://www.instagram.com/m0re0fme/",
    "https://x.com/10shubham01",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geist.variable,
        inter.variable,
        dmMono.variable,
        allura.variable,
        basteleur.variable,
        helveticaNeue.variable
      )}
      suppressHydrationWarning
    >
      <body className="h-full bg-gray-100 dark:bg-neutral-950" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("portfolio-theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
