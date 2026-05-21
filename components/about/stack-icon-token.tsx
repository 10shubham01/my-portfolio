import { TECH_ICON_MAP } from "@/components/about/tech-icons";
import type { TechId } from "@/lib/about-content";
import { TECH_LABELS } from "@/lib/about-content";

const tokenClass =
  "group/token inline-flex h-[1.65em] shrink-0 translate-y-[0.32em] items-center gap-[0.38em] rounded-md border border-dotted border-foreground/25 bg-foreground/[0.025] px-[0.32em] text-foreground/72 transition-[border-color,background-color] duration-200 hover:border-foreground/35 hover:bg-foreground/[0.04] dark:border-white/20 dark:bg-white/[0.035] dark:hover:border-white/28 dark:hover:bg-white/[0.05]";

const iconClass =
  "size-[1em] shrink-0 opacity-50 grayscale transition-[filter,opacity] duration-200 ease-out group-hover/token:opacity-100 group-hover/token:grayscale-0";

export function StackIconToken({ id }: { id: TechId }) {
  const Icon = TECH_ICON_MAP[id];
  const label = TECH_LABELS[id];

  return (
    <span role="img" aria-label={label} className={tokenClass}>
      <Icon className={iconClass} aria-hidden />
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
