"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

import { useLenisInstance } from "@/components/lenis-provider";
import { usePrefersMobilePerf } from "@/lib/motion-capability";
import { ROUGH_BORDER, ROUGH_BORDER_T } from "@/lib/rough-border";

const ACCENT = "#FF5800";
const TICK_COUNT = 15;
const AMBIENT_BARS_DESKTOP = 28;

function AmbientBar({
  index,
  scrollProgress,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const position = index / (AMBIENT_BARS_DESKTOP - 1);
  const pre = Math.max(0, position - 0.08);
  const post = Math.min(1, position + 0.08);
  const height = useTransform(scrollProgress, [0, pre, position, post, 1], [3, 8, 18, 8, 3]);
  const opacity = useTransform(
    scrollProgress,
    [0, pre, position, post, 1],
    [0.16, 0.38, 0.9, 0.38, 0.16],
  );

  return (
    <motion.span
      className="w-[2.5px] shrink-0 rounded-full bg-foreground sm:w-[3px]"
      style={{ height, opacity }}
      aria-hidden
    />
  );
}

const ScrollIndicatorBars = ({
  containerElement,
  direction,
  draggable,
}: {
  containerElement: HTMLElement | null;
  direction: "vertical" | "horizontal";
  draggable: boolean;
}) => {
  const ref = React.useRef<HTMLElement | null>(containerElement);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [scrollPercent, setScrollPercent] = React.useState(0);
  const hydrated = useHydrated();
  const mobilePerf = usePrefersMobilePerf();
  const ambientBars = mobilePerf ? 0 : AMBIENT_BARS_DESKTOP;
  const lenis = useLenisInstance();
  const percentRafRef = React.useRef<number | null>(null);
  const pendingPercentRef = React.useRef(0);

  React.useEffect(() => {
    ref.current = containerElement;
  }, [containerElement]);

  const { scrollXProgress, scrollYProgress } = useScroll(
    containerElement ? { container: ref } : undefined,
  );

  const scrollProgress = direction === "vertical" ? scrollYProgress : scrollXProgress;
  const fillWidth = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);
  const thumbLeft = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (!hydrated) return;
    setScrollPercent(Math.round(scrollProgress.get() * 100));
  }, [hydrated, scrollProgress]);

  const schedulePercentUpdate = React.useCallback((v: number) => {
    pendingPercentRef.current = Math.round(v * 100);
    if (percentRafRef.current !== null) return;
    percentRafRef.current = window.requestAnimationFrame(() => {
      percentRafRef.current = null;
      setScrollPercent((current) =>
        current === pendingPercentRef.current ? current : pendingPercentRef.current,
      );
    });
  }, []);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    if (!hydrated) return;
    schedulePercentUpdate(v);
  });

  React.useEffect(
    () => () => {
      if (percentRafRef.current !== null) {
        window.cancelAnimationFrame(percentRafRef.current);
      }
    },
    [],
  );

  const applyScrollFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));

      const scrollEl = ref.current;
      if (scrollEl) {
        if (direction === "vertical") {
          const max = scrollEl.scrollHeight - scrollEl.clientHeight;
          if (max <= 0) return;
          scrollEl.scrollTop = ratio * max;
        } else {
          const max = scrollEl.scrollWidth - scrollEl.clientWidth;
          if (max <= 0) return;
          scrollEl.scrollLeft = ratio * max;
        }
        return;
      }

      if (direction === "vertical") {
        if (lenis) {
          if (lenis.limit <= 0) return;
          lenis.scrollTo(ratio * lenis.limit, { immediate: true });
        } else {
          const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          if (max <= 0) return;
          window.scrollTo(0, ratio * max);
        }
      } else {
        const max = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        if (max <= 0) return;
        window.scrollTo(ratio * max, 0);
      }
    },
    [direction, lenis],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    applyScrollFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !dragRef.current) return;
    applyScrollFromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* released */
    }
  };

  return (
    <div className="group/scrubber flex flex-col items-center">
      <div
        ref={trackRef}
        className={
          draggable
            ? "pointer-events-auto relative flex w-fit cursor-grab touch-none select-none flex-col items-stretch active:cursor-grabbing"
            : "relative flex w-fit flex-col items-stretch"
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label={draggable ? "Drag horizontally to scroll the page" : undefined}
        role={draggable ? "slider" : undefined}
        aria-valuemin={draggable ? 0 : undefined}
        aria-valuemax={draggable ? 100 : undefined}
        aria-valuenow={draggable ? scrollPercent : undefined}
        aria-valuetext={draggable ? `${scrollPercent}%` : undefined}
      >
        <div
          className={`${ROUGH_BORDER} rb-border-55 dark:rb-white-10 flex flex-col gap-3 rounded-2xl px-5 py-3.5 transition-colors duration-200 sm:gap-3.5 sm:px-6 sm:py-4 md:px-7 md:py-4.5 ${
            mobilePerf
              ? isDragging
                ? "bg-background/98 dark:bg-background/92"
                : "bg-background/95 dark:bg-background/88"
              : isDragging
                ? "bg-background/90 backdrop-blur-md dark:bg-background/75"
                : "bg-background/82 backdrop-blur-md dark:bg-background/62"
          }`}
        >
          {/* Top row: labels + ambient waveform */}
          <div className="flex items-end justify-between gap-3">
            <span
              className="font-sans text-[11px] font-light uppercase tracking-[0.2em] text-muted-foreground/55 sm:text-xs"
              aria-hidden
            >
              scroll
            </span>
            <div
              className="flex h-6 flex-1 items-end justify-center gap-[3px] sm:h-7 sm:gap-1"
              aria-hidden
            >
              {ambientBars > 0 && hydrated
                ? Array.from({ length: ambientBars }).map((_, i) => (
                    <AmbientBar key={i} index={i} scrollProgress={scrollProgress} />
                  ))
                : null}
            </div>
            <span
              className={`min-w-[2.5rem] text-right font-sans text-[11px] font-light tabular-nums tracking-wide sm:text-xs ${
                isDragging ? "text-[#FF5800]" : "text-muted-foreground/65"
              }`}
              aria-hidden
            >
              {scrollPercent}%
            </span>
          </div>

          {/* Main scrubber row */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            <span
              className="font-display text-sm font-bold leading-none tracking-tight text-muted-foreground/70 sm:text-base"
              aria-hidden
            >
              [
            </span>

            <span
              className="font-display text-xs leading-none text-muted-foreground/45 sm:text-sm"
              aria-hidden
            >
              ‹
            </span>

            <div className="relative h-5 flex-1 min-w-[14rem] sm:min-w-[18rem] md:min-w-[20rem]">
              {/* Secondary dashed rail */}
              <div
                className={`${ROUGH_BORDER_T} rough-border-dotted rb-fg-12 dark:rb-white-12 absolute top-[18%] right-0 left-0 [--rough-border-color:color-mix(in_oklch,var(--foreground)_12%,transparent)] dark:[--rough-border-color:oklch(1_0_0/14%)]`}
                aria-hidden
              />
              <div
                className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 rounded-full bg-foreground/10 dark:bg-white/14"
                aria-hidden
              />
              <div
                className={`${ROUGH_BORDER_T} rough-border-dotted rb-fg-8 dark:rb-white-10 absolute bottom-[18%] right-0 left-0`}
                aria-hidden
              />

              <div
                className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 justify-between px-0.5"
                aria-hidden
              >
                {Array.from({ length: TICK_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-px shrink-0 rounded-full bg-foreground/18 dark:bg-white/22 ${
                      i === 0 || i === TICK_COUNT - 1 ? "h-3" : i % 2 === 0 ? "h-2.5" : "h-2"
                    }`}
                  />
                ))}
              </div>

              {hydrated ? (
                <>
                  <motion.div
                    className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full"
                    style={{
                      width: fillWidth,
                      background: `linear-gradient(90deg, ${ACCENT}55 0%, ${ACCENT} 100%)`,
                    }}
                    aria-hidden
                  />
                  <motion.div
                    className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: thumbLeft }}
                    animate={{ scale: isDragging ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    <div className="relative flex size-5 items-center justify-center rounded-full sm:size-6">
                      <span
                        className={`${ROUGH_BORDER} rb-accent-40 absolute inset-0 rounded-full bg-background/92 dark:bg-background/78`}
                        aria-hidden
                      />
                      <span className="relative flex gap-0.5" aria-hidden>
                        <span className="h-2.5 w-[2.5px] rounded-full bg-[#FF5800]/70 sm:h-3" />
                        <span className="h-3 w-[2.5px] rounded-full bg-[#FF5800] sm:h-3.5" />
                        <span className="h-2.5 w-[2.5px] rounded-full bg-[#FF5800]/70 sm:h-3" />
                      </span>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <div
                    className="absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 rounded-full bg-[#FF5800]/40"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2"
                    aria-hidden
                  >
                    <div className="relative flex size-5 items-center justify-center rounded-full sm:size-6">
                      <span
                        className={`${ROUGH_BORDER} rb-accent-40 absolute inset-0 rounded-full bg-background/92 dark:bg-background/78`}
                        aria-hidden
                      />
                      <span className="relative flex gap-0.5" aria-hidden>
                        <span className="h-2.5 w-[2.5px] rounded-full bg-[#FF5800]/70 sm:h-3" />
                        <span className="h-3 w-[2.5px] rounded-full bg-[#FF5800] sm:h-3.5" />
                        <span className="h-2.5 w-[2.5px] rounded-full bg-[#FF5800]/70 sm:h-3" />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <span
              className="font-display text-xs leading-none text-muted-foreground/45 sm:text-sm"
              aria-hidden
            >
              ›
            </span>

            <span
              className="font-display text-sm font-bold leading-none tracking-tight text-muted-foreground/70 sm:text-base"
              aria-hidden
            >
              ]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollIndicator = ({
  scrollContainerId,
  direction,
  draggable,
}: {
  scrollContainerId: string;
  direction: "vertical" | "horizontal";
  draggable: boolean;
}) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setContainer(document.getElementById(scrollContainerId));
    });
    return () => {
      cancelled = true;
    };
  }, [scrollContainerId]);

  if (!container) {
    return null;
  }

  return (
    <ScrollIndicatorBars
      containerElement={container}
      direction={direction}
      draggable={draggable}
    />
  );
};

export default function GlowingScrollIndicator({
  scrollContainerId,
  direction = "vertical",
  draggable = true,
}: {
  scrollContainerId?: string;
  direction?: "vertical" | "horizontal";
  /** When true, drag horizontally on the indicator to seek scroll position. */
  draggable?: boolean;
}) {
  const pathname = usePathname();

  if (scrollContainerId) {
    return (
      <ScrollIndicator
        key={pathname}
        scrollContainerId={scrollContainerId}
        direction={direction}
        draggable={draggable}
      />
    );
  }

  return (
    <ScrollIndicatorBars
      key={pathname}
      containerElement={null}
      direction={direction}
      draggable={draggable}
    />
  );
}
