import type { Metadata } from "next"
import { DM_Mono, Geist, Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

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

export const metadata: Metadata = {
  title: "Shubham Gupta | Software Engineer @ WebMD",
  description:
    "Shubham Gupta — senior software engineer at WebMD in Mumbai, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development. Previously senior engineer at Credilio Financial Technologies.",
  authors: [{ name: "Shubham Gupta", url: "https://shubhamgupta.dev" }],
  keywords: [
    "Shubham Gupta",
    "Shubham Gupta WebMD",
    "Shubham Gupta software engineer",
    "Shubham Gupta Mumbai",
    "Shubham Gupta portfolio",
    "Shubham Gupta Credilio",
    "software engineer WebMD",
    "senior software engineer Mumbai",
    "full stack developer India",
    "React developer Mumbai",
    "Next.js developer",
  ],
  openGraph: {
    title: "Shubham Gupta | Software Engineer @ WebMD",
    description:
      "Shubham Gupta — senior software engineer at WebMD in Mumbai, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development.",
    url: "https://shubhamgupta.dev",
    siteName: "Shubham Gupta",
    type: "profile",
    images: [
      {
        url: "https://shubhamgupta.dev/images/logo/og-image.png",
        width: 1200,
        height: 675,
        alt: "Shubham Gupta — Senior Software Engineer at WebMD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@10shubham01",
    title: "Shubham Gupta | Software Engineer @ WebMD",
    description:
      "Shubham Gupta — senior software engineer at WebMD in Mumbai, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development.",
    images: ["https://shubhamgupta.dev/images/logo/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
  image: "https://shubhamgupta.dev/images/logo/logo.png",
  description:
    "Shubham Gupta — senior software engineer at WebMD in Mumbai, India. Portfolio, work, and writing on React, Next.js, Vue, TypeScript, and full-stack web development. Previously senior engineer at Credilio Financial Technologies.",
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
    "https://www.linkedin.com/in/shubhamgupta001/",
    "https://peerlist.io/10shubham01",
    "https://www.instagram.com/m0re0fme/",
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
        dmMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="h-full bg-gray-100" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
