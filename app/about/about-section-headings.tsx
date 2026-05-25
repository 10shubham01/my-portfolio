"use client";

import { useCallback, useEffect, useRef } from "react";

import { AlienText } from "@/components/alien-text";
import { cn } from "@/lib/utils";

interface AboutSectionHeadingsProps {
  labels: string[];
  activeIndex: number;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ENTER = `transform 0.85s ${EASE}, opacity 0.85s ${EASE}, filter 0.85s ${EASE}`;
const EXIT = `transform 0.6s ${EASE}, opacity 0.4s ease-out, filter 0.6s ${EASE}`;

const DOT_ENTER_DELAY = `transform 0.85s ${EASE} 1s, opacity 0.85s ${EASE} 1s`;
const DOT_ENTER_IMMEDIATE = `transform 0.85s ${EASE}, opacity 0.85s ${EASE}`;
const DOT_EXIT = `transform 0.6s ${EASE}, opacity 0.4s ease-out`;

function applyHidden(el: HTMLElement) {
  el.style.transition = "none";
  el.style.transform = "translateY(-28px)";
  el.style.opacity = "0";
  el.style.filter = "blur(14px)";
}

function applyEnter(el: HTMLElement) {
  applyHidden(el);
  el.getBoundingClientRect();
  el.style.transition = ENTER;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
  el.style.filter = "blur(0px)";
}

function applyExit(el: HTMLElement, goingDown: boolean) {
  el.style.transition = EXIT;
  el.style.transform = goingDown ? "translateY(28px)" : "translateY(-28px)";
  el.style.opacity = "0";
  el.style.filter = "blur(14px)";
}

function applyDotHidden(el: HTMLElement) {
  el.style.transition = "none";
  el.style.transform = "translateY(-40px)";
  el.style.opacity = "0";
}

function applyDotEnter(el: HTMLElement, fromTop: boolean, isInitial: boolean) {
  el.style.transition = "none";
  el.style.transform = fromTop ? "translateY(-40px)" : "translateY(40px)";
  el.style.opacity = "0";
  el.getBoundingClientRect();

  el.style.transition = isInitial ? DOT_ENTER_IMMEDIATE : DOT_ENTER_DELAY;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
}

function applyDotExit(el: HTMLElement, exitDown: boolean) {
  el.style.transition = DOT_EXIT;
  el.style.transform = exitDown ? "translateY(40px)" : "translateY(-40px)";
  el.style.opacity = "0";
}

export function AboutSectionHeadings({ labels, activeIndex }: AboutSectionHeadingsProps) {
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

  useEffect(() => {
    const prev = prevRef.current;
    const goingDown = activeIndex > prev;
    const isInitial = prev === -1;
    prevRef.current = activeIndex;

    headingRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyEnter(el);
      } else if (i === prev && prev >= 0) {
        applyExit(el, goingDown);
      } else {
        applyHidden(el);
      }
    });

    dotRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyDotEnter(el, goingDown, isInitial);
      } else if (i === prev && prev >= 0) {
        applyDotExit(el, goingDown);
      } else {
        applyDotHidden(el);
      }
    });
  }, [activeIndex]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[81]"
      style={{
        height: "var(--about-fixed-line-top)",
        touchAction: "manipulation",
      }}
      aria-hidden
    >
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
                transform: "translateY(-28px)",
                opacity: 0,
                filter: "blur(14px)",
                willChange: "transform, opacity, filter",
              }}
            >
              <AlienText text={label} />
              <span style={{ color: "#FF5800" }}>.</span>
            </div>
          ))}
        </div>
      </div>

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
