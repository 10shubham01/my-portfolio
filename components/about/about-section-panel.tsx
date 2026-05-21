import type { ReactNode } from "react";

import { ROUGH_BORDER } from "@/lib/rough-border";

/** Scrollable panel for dense About sections (experience, projects, etc.). */
export function AboutSectionPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`about-section-panel hide-scrollbar pointer-events-auto w-full max-w-2xl overflow-y-auto rounded-md px-2 py-1 text-left ${className}`}
      style={{ maxHeight: "min(var(--about-content-max-h), 28rem)" }}
    >
      {children}
    </div>
  );
}

export const aboutCardClass = `${ROUGH_BORDER} rough-border-dotted rb-fg-20 dark:rb-white-15 rounded-md bg-foreground/[0.02] px-3 py-2.5 dark:bg-white/[0.03]`;

export const aboutMetaClass =
  "font-sans text-[11px] font-light uppercase tracking-[0.18em] text-[#FF5800] sm:text-xs";

export const aboutBodyClass =
  "font-sans text-sm font-bold leading-relaxed text-foreground/90 md:text-base";

/** Centered About copy (stack, education, achievements) — no card chrome. */
export const aboutProseClass =
  "mx-auto w-full max-w-2xl px-2 py-0 text-center font-sans font-bold text-base leading-[1.75] tracking-normal text-foreground md:text-lg md:leading-[1.85]";

export const aboutBulletClass = "mt-1.5 space-y-1 pl-0 text-sm font-bold leading-snug text-foreground/80 md:text-[15px]";
