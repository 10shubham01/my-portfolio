import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
export const metadata: Metadata = {
  title: "Shubham Gupta",
  description: "A Frontend developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-J0KJVW0YZH"></GoogleTagManager>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
