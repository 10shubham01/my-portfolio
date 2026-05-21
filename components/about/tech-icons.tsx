import type { IconType } from "react-icons";
import type { SVGProps } from "react";
import { FaAws } from "react-icons/fa6";
import {
  SiAdonisjs,
  SiExpress,
  SiFramer,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNuxt,
  SiPinia,
  SiPostgresql,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiZod,
} from "react-icons/si";

import type { TechId } from "@/lib/about-content";

export type TechIconComponent = IconType;

/** Remotion is not in Simple Icons — minimal mark from their wordmark geometry. */
function RemotionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" fill="#0B84F3" />
    </svg>
  );
}

export const TECH_ICON_MAP: Record<TechId, TechIconComponent> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  vue: SiVuedotjs,
  nuxt: SiNuxt,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwind: SiTailwindcss,
  framer: SiFramer,
  node: SiNodedotjs,
  express: SiExpress,
  adonis: SiAdonisjs,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  aws: FaAws,
  vite: SiVite,
  webpack: SiWebpack,
  redux: SiRedux,
  pinia: SiPinia,
  zod: SiZod,
  remotion: RemotionIcon,
};
