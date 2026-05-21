import { TECH_ICON_COLORS, TECH_ICON_MAP } from "@/components/about/tech-icons";
import type { TechId } from "@/lib/about-content";
import { TECH_LABELS } from "@/lib/about-content";
import type { CSSProperties } from "react";

import { ROUGH_BORDER } from "@/lib/rough-border";

const tokenClass = `${ROUGH_BORDER} rough-border-dotted rb-fg-20 dark:rb-white-20 group/token inline-flex h-[1.65em] shrink-0 translate-y-[0.32em] items-center gap-[0.38em] rounded-md bg-foreground/[0.025] px-[0.32em] text-foreground/72 transition-[background-color] duration-200 hover:bg-foreground/[0.04] dark:bg-white/[0.035] dark:hover:bg-white/[0.05] hover:[--rough-border-color:color-mix(in_oklch,var(--foreground)_35%,transparent)] dark:hover:[--rough-border-color:oklch(1_0_0/28%)]`;

const iconClass =
  "size-[1em] shrink-0 opacity-50 grayscale transition-[filter,opacity,color] duration-200 ease-out group-hover/token:opacity-100 group-hover/token:grayscale-0 group-hover/token:text-[var(--tech-icon-color)]";

const darkHoverWhite: TechId[] = ["nextjs", "express"];

export function StackIconToken({ id }: { id: TechId }) {
  const Icon = TECH_ICON_MAP[id];
  const label = TECH_LABELS[id];
  const tokenStyle = { "--tech-icon-color": TECH_ICON_COLORS[id] } as CSSProperties;
  const iconHoverClass = darkHoverWhite.includes(id)
    ? `${iconClass} dark:group-hover/token:text-white`
    : iconClass;

  return (
    <span role="img" aria-label={label} className={tokenClass} style={tokenStyle}>
      <Icon className={iconHoverClass} aria-hidden />
      <span className="whitespace-nowrap text-[0.62em] font-bold leading-none" aria-hidden>
        {label}
      </span>
    </span>
  );
}

export function TechChips({ ids }: { ids: TechId[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
      {ids.map((id) => (
        <StackIconToken key={id} id={id} />
      ))}
    </div>
  );
}
