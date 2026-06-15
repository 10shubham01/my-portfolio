export type {
  CanvasItem,
  CanvasItemConfig,
  CanvasItemType,
  CanvasComponentId,
} from "@/lib/canvas-config"
export { CANVAS_ITEMS, loadCanvasItems } from "@/lib/canvas-config"

export const SITE = {
  name: "Shubham Gupta",
  title: "Senior Software Engineer",
  company: "WebMD",
  location: "Mumbai",
  age: 25,
  tagline: "Yo, I'm Shubham and I build web experiences.",
  url: "https://shubhamgupta.dev",
  twitter: "@10shubham01",
} as const

export const SOCIAL_LINKS = [
  {
    platform: "LINKEDIN",
    handle: "/IN/SHUBHAMGUPTA001",
    href: "https://www.linkedin.com/in/shubhamgupta001/",
  },
  {
    platform: "GITHUB",
    handle: "/10SHUBHAM01",
    href: "https://github.com/10shubham01",
  },
  {
    platform: "PEERLIST",
    handle: "/10SHUBHAM01",
    href: "https://peerlist.io/10shubham01",
  },
  {
    platform: "INSTAGRAM",
    handle: "/M0RE0FME",
    href: "https://www.instagram.com/m0re0fme/",
  },
  {
    platform: "TWITTER",
    handle: "/10SHUBHAM01",
    href: "https://twitter.com/10shubham01",
  },
  {
    platform: "RESUME",
    handle: "/PDF",
    href: "https://www.shubhamgupta.dev/shubham-gupta.pdf",
  },
  {
    platform: "WRITINGS",
    handle: "/BLOG",
    href: "https://www.shubhamgupta.dev/writings",
  },
] as const

export const EMAIL = "shubhamedu.01@gmail.com"
export const DEFAULT_BG = "#f5f5f5"
