import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Shubham Gupta - Frontend Developer | Web Developer | Full Stack Developer | React Expert",
  description:
    "Shubham Gupta is a Senior Software Engineer and expert Frontend Developer specializing in React, Next.js, Vue.js, and TypeScript. Professional web developer with 4+ years experience building modern web applications. Available for hire as a full-stack developer.",
  keywords: [
    "Shubham Gupta",
    "Shubham",
    "Gupta",
    "Frontend Developer",
    "Front-end Developer",
    "Web Developer",
    "Full Stack Developer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Vue.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Software Engineer",
    "Senior Software Engineer",
    "Credilio",
    "React",
    "Next.js",
    "Vue.js",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Frontend Development",
    "UI/UX Developer",
    "Modern Web Apps",
    "Responsive Design",
    "Progressive Web Apps",
    "Hire Developer",
    "Freelance Developer",
    "Portfolio",
    "Web Developer India",
    "React Developer India",
    "Frontend Developer India"
  ].join(", "),
  authors: [{ name: "Shubham Gupta" }],
  creator: "Shubham Gupta",
  publisher: "Shubham Gupta",
  category: "Technology",
  classification: "Web Development",
  openGraph: {
    title: "Shubham Gupta - Expert Frontend Developer & Full Stack Engineer",
    description:
      "Professional Frontend Developer with expertise in React, Next.js, Vue.js, and TypeScript. 4+ years building modern web applications. Available for hire.",
    url: "https://www.shubhamgupta.dev",
    siteName: "Shubham Gupta Portfolio",
    images: [
      {
        url: "https://www.shubhamgupta.dev/images/profile.jpeg",
        width: 1200,
        height: 630,
        alt: "Shubham Gupta - Frontend Developer",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Gupta - Frontend Developer | Web Developer | Full Stack Engineer",
    description:
      "Expert Frontend Developer specializing in React, Next.js, Vue.js, and TypeScript. Building modern web applications with 4+ years experience.",
    images: "https://www.shubhamgupta.dev/images/profile.jpeg",
    creator: "@shubhamgupta",
    site: "@shubhamgupta",
  },
  alternates: {
    canonical: "https://www.shubhamgupta.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-J0KJVW0YZH"></GoogleAnalytics>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
