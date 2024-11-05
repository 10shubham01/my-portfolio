import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  // Outfit,
  // Plus_Jakarta_Sans,
  // Montserrat_Alternates,
  Manrope,
} from "next/font/google";
import "./globals.css";
const plus_Jakarta_Sans = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  preload: true,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={plus_Jakarta_Sans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <GoogleAnalytics gaId="G-J0KJVW0YZH"></GoogleAnalytics>
        </body>
      </html>
    </>
  );
}
