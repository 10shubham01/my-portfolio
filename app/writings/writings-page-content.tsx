"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { AlienText } from "@/components/alien-text";
import type { DevUtil } from "@/lib/dev-utils-data";
import type { WritingPreview } from "@/lib/writings";
import { ROUGH_BORDER, ROUGH_ROW_ACTIVE, ROUGH_ROW_IDLE } from "@/lib/rough-border";
import { WritingsSpotlight } from "./writings-spotlight";
import { WritingsUtilsSection } from "./writings-utils-section";

type SpotlightMode = "writing" | "util";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

function WritingTransitionLink({
  href,
  children,
  className,
  ariaLabel,
  onIntent,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onIntent?: () => void;
}) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const doc = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersDirectNavigation = window.matchMedia("(pointer: coarse)").matches;

    if (!doc.startViewTransition || prefersReducedMotion || prefersDirectNavigation) {
      return;
    }

    event.preventDefault();
    onIntent?.();

    doc.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={handleClick}
      onFocus={onIntent}
    >
      {children}
    </Link>
  );
}

function WritingRow({
  writing,
  isActive,
  onIntent,
  index,
}: {
  writing: WritingPreview;
  isActive: boolean;
  onIntent: () => void;
  index: number;
}) {
  return (
    <li data-writing-index={index} onMouseEnter={onIntent}>
      <WritingTransitionLink
        href={writing.href}
        ariaLabel={`Open ${writing.title}`}
        onIntent={onIntent}
        className={`${ROUGH_BORDER} group flex min-h-11 cursor-pointer select-none items-center gap-1.5 rounded-xl px-1 py-1.5 text-[16px] leading-6 transition-[background-color,color,box-shadow] duration-200 ${
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
          {writing.title}
        </span>
        <span className="h-px min-w-24 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/45 transition-colors group-hover:bg-foreground/8 group-hover:text-foreground/85 dark:group-hover:bg-white/8">
          <ArrowSquareOutIcon size={16} weight="regular" />
        </span>
      </WritingTransitionLink>
    </li>
  );
}

export function WritingsPageContent({
  writings,
  utils,
  utilsRepoUrl,
}: {
  writings: WritingPreview[];
  utils: DevUtil[];
  utilsRepoUrl: string;
}) {
  const [spotlightMode, setSpotlightMode] = useState<SpotlightMode>("writing");
  const [activeWritingIndex, setActiveWritingIndex] = useState(0);
  const [activeUtilIndex, setActiveUtilIndex] = useState(0);
  const writingsListRef = useRef<HTMLUListElement | null>(null);
  const utilsListRef = useRef<HTMLUListElement | null>(null);
  const spotlightModeRef = useRef<SpotlightMode>("writing");
  const activeWritingIndexRef = useRef(0);
  const activeUtilIndexRef = useRef(0);

  const writingMaxIndex = Math.max(0, writings.length - 1);
  const utilMaxIndex = Math.max(0, utils.length - 1);
  const safeWritingIndex = writings.length === 0 ? 0 : Math.max(0, Math.min(activeWritingIndex, writingMaxIndex));
  const safeUtilIndex = utils.length === 0 ? 0 : Math.max(0, Math.min(activeUtilIndex, utilMaxIndex));

  useEffect(() => {
    spotlightModeRef.current = spotlightMode;
  }, [spotlightMode]);

  useEffect(() => {
    activeWritingIndexRef.current = safeWritingIndex;
  }, [safeWritingIndex]);

  useEffect(() => {
    activeUtilIndexRef.current = safeUtilIndex;
  }, [safeUtilIndex]);

  const listScrollBehavior = useCallback((): ScrollBehavior => {
    if (typeof window === "undefined") return "auto";
    return window.matchMedia("(pointer: coarse)").matches ? "auto" : "smooth";
  }, []);

  const scrollToWriting = useCallback(
    (index: number) => {
      const target = writingsListRef.current?.querySelector<HTMLLIElement>(
        `[data-writing-index="${index}"]`,
      );
      target?.scrollIntoView({ block: "nearest", behavior: listScrollBehavior() });
    },
    [listScrollBehavior],
  );

  const scrollToUtil = useCallback(
    (index: number) => {
      const target = utilsListRef.current?.querySelector<HTMLLIElement>(
        `[data-util-index="${index}"]`,
      );
      target?.scrollIntoView({ block: "nearest", behavior: listScrollBehavior() });
    },
    [listScrollBehavior],
  );

  const commitWritingIndex = useCallback(
    (nextIndex: number) => {
      if (writings.length === 0) return;
      const clamped = Math.max(0, Math.min(nextIndex, writingMaxIndex));
      setSpotlightMode("writing");
      setActiveWritingIndex(clamped);
      scrollToWriting(clamped);
    },
    [scrollToWriting, writingMaxIndex, writings.length],
  );

  const commitUtilIndex = useCallback(
    (nextIndex: number) => {
      if (utils.length === 0) return;
      const clamped = Math.max(0, Math.min(nextIndex, utilMaxIndex));
      setSpotlightMode("util");
      setActiveUtilIndex(clamped);
      scrollToUtil(clamped);
    },
    [scrollToUtil, utilMaxIndex, utils.length],
  );

  const moveSpotlightBy = useCallback(
    (delta: number) => {
      const mode = spotlightModeRef.current;

      if (mode === "util") {
        if (utils.length === 0) return;
        commitUtilIndex(activeUtilIndexRef.current + delta);
        return;
      }

      if (writings.length === 0) return;

      const nextWriting = activeWritingIndexRef.current + delta;
      if (nextWriting > writingMaxIndex && utils.length > 0) {
        commitUtilIndex(0);
        return;
      }
      if (nextWriting < 0) return;

      commitWritingIndex(nextWriting);
    },
    [commitUtilIndex, commitWritingIndex, utils.length, writingMaxIndex, writings.length],
  );

  useEffect(() => {
    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        moveSpotlightBy(1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        if (spotlightModeRef.current === "util" && activeUtilIndexRef.current === 0 && writings.length > 0) {
          commitWritingIndex(writingMaxIndex);
          return;
        }
        moveSpotlightBy(-1);
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onDocumentKeyDown, { capture: true });
  }, [commitWritingIndex, moveSpotlightBy, writingMaxIndex, writings.length]);

  return (
    <>
      <WritingsSpotlight
        writings={writings}
        utils={utils}
        writingIndex={safeWritingIndex}
        utilIndex={safeUtilIndex}
        mode={spotlightMode}
      />

      <section
        className="page-inner-scroll hide-scrollbar relative z-10 mx-auto h-dvh w-full max-w-5xl overflow-y-auto px-4 pb-16 sm:px-6"
        style={{ paddingTop: "calc(var(--about-fixed-line-top, 20dvh) + 6px)" }}
      >
        <h1 className="sr-only">Writings</h1>

        <p
          aria-label="Writings"
          className="mb-3 font-sans text-[10px] font-light uppercase tracking-[0.22em] text-muted-foreground/70 sm:text-[11px]"
        >
          <AlienText text="Writings" />
        </p>

        <ul
          ref={writingsListRef}
          className="mx-auto w-full max-w-(--writing-content-width) space-y-0.5 outline-none"
          tabIndex={0}
          aria-label="Writings list"
        >
          {writings.map((writing, index) => (
            <WritingRow
              key={writing.title}
              writing={writing}
              index={index}
              isActive={spotlightMode === "writing" && index === safeWritingIndex}
              onIntent={() => commitWritingIndex(index)}
            />
          ))}
        </ul>

        <WritingsUtilsSection
          utils={utils}
          repoUrl={utilsRepoUrl}
          listRef={utilsListRef}
          activeIndex={safeUtilIndex}
          isActiveSection={spotlightMode === "util"}
          onActiveIndexChange={commitUtilIndex}
        />
      </section>
    </>
  );
}
