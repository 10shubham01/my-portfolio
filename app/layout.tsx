import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
export const metadata = {
  title: "Shubham Gupta – Senior Software Engineer at Credilio",
  description:
    "Shubham Gupta is a Senior Software Engineer at Credilio, specializing in frontend development with expertise in React, Next.js, and TypeScript.",
  keywords:
    "Shubham Gupta, Senior Software Engineer, Credilio, Frontend Developer, React, Next.js, TypeScript, JavaScript, Web Development, Software Engineer, Full Stack Developer",
  openGraph: {
    title: "Shubham Gupta – Senior Software Engineer at Credilio",
    description:
      "Shubham Gupta is a Senior Software Engineer at Credilio, specializing in frontend development with expertise in React, Next.js, and TypeScript.",
    url: "https://www.shubhamgupta.dev",
    image: "https://www.shubhamgupta.dev/images/profile.jepg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Gupta – Senior Software Engineer at Credilio",
    description:
      "Shubham Gupta is a Senior Software Engineer at Credilio, specializing in frontend development with expertise in React, Next.js, and TypeScript.",
    image: "https://www.shubhamgupta.dev/images/profile.jepg",
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
