"use client";

import Link from "next/link";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { RefObject } from "react";
import { AlienText } from "@/components/alien-text";
import { getDevUtilHref, type DevUtil } from "@/lib/dev-utils-data";
import { ROUGH_BORDER, ROUGH_ROW_ACTIVE, ROUGH_ROW_IDLE } from "@/lib/rough-border";

type WritingsUtilsSectionProps = {
  utils: DevUtil[];
  repoUrl: string;
  listRef: RefObject<HTMLUListElement | null>;
  activeIndex: number;
  isActiveSection: boolean;
  onActiveIndexChange: (index: number) => void;
};

function UtilRow({
  util,
  index,
  isActive,
  onIntent,
}: {
  util: DevUtil;
  index: number;
  isActive: boolean;
  onIntent: () => void;
}) {
  return (
    <li data-util-index={index} onMouseEnter={onIntent}>
      <Link
        href={getDevUtilHref(util.id)}
        aria-label={`Open ${util.title} source`}
        className={`${ROUGH_BORDER} group flex min-h-11 items-center gap-1.5 rounded-xl px-1 py-1.5 text-[16px] leading-6 transition-[background-color,color,box-shadow] duration-200 ${
          isActive
            ? `${ROUGH_ROW_ACTIVE} bg-foreground/7 text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:bg-white/10 dark:shadow-none`
            : `${ROUGH_ROW_IDLE} text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5`
        }`}
      >
        <span
          className={`min-w-0 flex-1 basis-0 break-words pl-2.5 leading-snug ${
            isActive ? "font-medium text-foreground" : "font-medium text-foreground/90"
          }`}
        >
          {util.title}
        </span>
        <span className="h-px min-w-24 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/45 transition-colors group-hover:bg-foreground/8 group-hover:text-foreground/85 dark:group-hover:bg-white/8">
          <ArrowSquareOutIcon size={16} weight="regular" />
        </span>
      </Link>
    </li>
  );
}

export function WritingsUtilsSection({
  utils,
  repoUrl,
  listRef,
  activeIndex,
  isActiveSection,
  onActiveIndexChange,
}: WritingsUtilsSectionProps) {
  if (utils.length === 0) return null;

  return (
    <div className="mt-14">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <p
          aria-label="Dev utils"
          className="font-sans text-[10px] font-light uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]"
        >
          <AlienText text="Utils" />
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/writings/utils"
            className="font-mono text-[10px] tracking-[0.12em] text-foreground/45 uppercase transition-colors hover:text-foreground/80"
          >
            All utils
          </Link>
          <Link
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-foreground/45 uppercase transition-colors hover:text-foreground/80"
          >
            <GithubLogoIcon size={14} weight="regular" />
            View repo
          </Link>
        </div>
      </div>
      <ul
        ref={listRef}
        className="mx-auto w-full max-w-(--writing-content-width) space-y-0.5 outline-none"
        aria-label="Dev utils list"
      >
        {utils.map((util, index) => (
          <UtilRow
            key={util.id}
            util={util}
            index={index}
            isActive={isActiveSection && index === activeIndex}
            onIntent={() => onActiveIndexChange(index)}
          />
        ))}
      </ul>
    </div>
  );
}
