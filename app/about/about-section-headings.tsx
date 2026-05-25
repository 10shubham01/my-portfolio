"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { AlienText } from "@/components/alien-text";
import { usePrefersLightMotion } from "@/lib/motion-capability";
import { cn } from "@/lib/utils";

/**
 * Section headings displayed above the orange line, right-aligned to the
 * content area. Animates in/out based on the active section index
 * (driven by the snap-scroll hook).
 *
 * Animation mirrors the descriptions' framer-motion reveal:
 *   - Fades in from `opacity: 0` → `1`
 *   - Slides from `translateY(-28px)` → `0`
 *   - Unblurs from `blur(14px)` → `blur(0px)`
 *   - Duration ~0.85s with cubic-bezier(0.16, 1, 0.3, 1)
 *
 * @example
 * <AboutSectionHeadings labels={["HELLO", "STACK", "CONTRI"]} activeIndex={0} />
 */

interface AboutSectionHeadingsProps {
  /** Labels for each section. */
  labels: string[];
  /** Currently active section index (from useSnapScroll). */
  activeIndex: number;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function motionTokens(light: boolean) {
  const enterDur = light ? "0.45s" : "0.85s";
  const exitDur = light ? "0.35s" : "0.6s";
  const filterPart = light ? "" : `, filter ${enterDur} ${EASE}`;
  const filterExit = light ? "" : `, filter ${exitDur} ${EASE}`;
  return {
    enter: `transform ${enterDur} ${EASE}, opacity ${enterDur} ${EASE}${filterPart}`,
    exit: `transform ${exitDur} ${EASE}, opacity 0.35s ease-out${filterExit}`,
    dotEnterDelay: `transform ${enterDur} ${EASE} ${light ? "0s" : "1s"}, opacity ${enterDur} ${EASE} ${light ? "0s" : "1s"}`,
    dotEnterImmediate: `transform ${enterDur} ${EASE}, opacity ${enterDur} ${EASE}`,
    dotExit: `transform ${exitDur} ${EASE}, opacity 0.35s ease-out`,
    yHidden: light ? -16 : -28,
    yExit: light ? 16 : 28,
    dotHidden: light ? -24 : -40,
    dotTravel: light ? 24 : 40,
    useBlur: !light,
  };
}

function applyHidden(el: HTMLElement, tokens: ReturnType<typeof motionTokens>) {
  el.style.transition = "none";
  el.style.transform = `translateY(${tokens.yHidden}px)`;
  el.style.opacity = "0";
  el.style.filter = tokens.useBlur ? "blur(14px)" : "none";
}

function applyEnter(el: HTMLElement, tokens: ReturnType<typeof motionTokens>) {
  applyHidden(el, tokens);
  el.getBoundingClientRect();
  el.style.transition = tokens.enter;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
  el.style.filter = tokens.useBlur ? "blur(0px)" : "none";
}

function applyExit(el: HTMLElement, goingDown: boolean, tokens: ReturnType<typeof motionTokens>) {
  el.style.transition = tokens.exit;
  el.style.transform = goingDown
    ? `translateY(${tokens.yExit}px)`
    : `translateY(${-tokens.yExit}px)`;
  el.style.opacity = "0";
  el.style.filter = tokens.useBlur ? "blur(14px)" : "none";
}

function applyDotHidden(el: HTMLElement, tokens: ReturnType<typeof motionTokens>) {
  el.style.transition = "none";
  el.style.transform = `translateY(${-tokens.dotHidden}px)`;
  el.style.opacity = "0";
}

function applyDotEnter(
  el: HTMLElement,
  fromTop: boolean,
  isInitial: boolean,
  tokens: ReturnType<typeof motionTokens>,
) {
  el.style.transition = "none";
  el.style.transform = fromTop
    ? `translateY(${-tokens.dotTravel}px)`
    : `translateY(${tokens.dotTravel}px)`;
  el.style.opacity = "0";
  el.getBoundingClientRect();

  el.style.transition = isInitial ? tokens.dotEnterImmediate : tokens.dotEnterDelay;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
}

function applyDotExit(el: HTMLElement, exitDown: boolean, tokens: ReturnType<typeof motionTokens>) {
  el.style.transition = tokens.dotExit;
  el.style.transform = exitDown
    ? `translateY(${tokens.dotTravel}px)`
    : `translateY(${-tokens.dotTravel}px)`;
  el.style.opacity = "0";
}

export function AboutSectionHeadings({ labels, activeIndex }: AboutSectionHeadingsProps) {
  const lightMotion = usePrefersLightMotion();
  const tokens = useMemo(() => motionTokens(lightMotion), [lightMotion]);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevRef = useRef(-1);

  const setHeadingRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      headingRefs.current[i] = el;
    },
    [],
  );

  const setDotRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      dotRefs.current[i] = el;
    },
    [],
  );

  /* Animate headings and dots whenever activeIndex changes */
  useEffect(() => {
    const prev = prevRef.current;
    const goingDown = activeIndex > prev;
    const isInitial = prev === -1;
    prevRef.current = activeIndex;

    headingRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyEnter(el, tokens);
      } else if (i === prev && prev >= 0) {
        applyExit(el, goingDown, tokens);
      } else {
        applyHidden(el, tokens);
      }
    });

    dotRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyDotEnter(el, goingDown, isInitial, tokens);
      } else if (i === prev && prev >= 0) {
        applyDotExit(el, goingDown, tokens);
      } else {
        applyDotHidden(el, tokens);
      }
    });
  }, [activeIndex, tokens]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[81]"
      style={{
        height: "var(--about-fixed-line-top)",
        touchAction: "manipulation",
      }}
      aria-hidden
    >
      {/* Headings layer - clipped with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-2xl items-end justify-end px-4 pb-2 sm:px-6">
          {labels.map((label, i) => (
            <div
              key={label}
              ref={setHeadingRef(i)}
              className={cn(
                "absolute right-8 bottom-2 max-w-[min(100%,18rem)] text-right font-oblique text-base leading-tight tracking-tight text-foreground sm:right-10 sm:text-lg lg:right-8 md:text-xl",
                i === activeIndex ? "pointer-events-auto" : "pointer-events-none",
              )}
              style={{
                transform: `translateY(${tokens.yHidden}px)`,
                opacity: 0,
                filter: tokens.useBlur ? "blur(14px)" : "none",
                willChange: tokens.useBlur ? "transform, opacity, filter" : "transform, opacity",
              }}
            >
              <AlienText text={label} />
              <span style={{ color: "#FF5800" }}>.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dots layer - no overflow-hidden so dots can span the line */}
      <div className="absolute inset-0">
        <div className="relative mx-auto h-full w-full max-w-2xl">
          {labels.map((label, i) => (
            <div
              key={`dot-${label}`}
              ref={setDotRef(i)}
              className="absolute left-8 h-4 w-4 rounded-full bg-[#FF5800] sm:left-10 lg:left-8"
              style={{
                bottom: "12px",
                transform: "translateY(-40px)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
