"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AboutSnapSlide } from "@/components/about/about-snap-slide";
import { InView } from "@/components/core/in-view";
import GlowingScrollIndicator from "@/components/glowing-scroll-indicator";
import { OrangeMidLine } from "@/components/orange-mid-line";
import { buildAboutSnapSections, getAboutSectionLabels } from "@/lib/about-snap-sections";

import { AboutViewportMask } from "./about-viewport-mask";
import { AboutSectionHeadings } from "./about-section-headings";
import { useSnapScroll } from "./use-snap-scroll";

const scrollReveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

const inViewTransition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1] as const,
};

const snapSectionClass =
  "about-snap-section mx-auto box-border flex min-h-dvh w-full flex-col items-center justify-start px-4 pb-20 text-center sm:px-6";

const snapSectionStyle = {
  paddingTop: "calc(var(--about-fixed-line-top) + 0.35rem)",
} as const;

const ABOUT_SNAP_SECTIONS = buildAboutSnapSections();
const SECTION_LABELS = getAboutSectionLabels(ABOUT_SNAP_SECTIONS);

export function AboutPageContent() {
  const [holeEl, setHoleEl] = useState<HTMLDivElement | null>(null);
  const holeRootRef = useRef<HTMLDivElement | null>(null);

  const { activeIndex } = useSnapScroll({
    sectionCount: ABOUT_SNAP_SECTIONS.length,
    duration: 0.85,
    ease: "power3.inOut",
  });

  useEffect(() => {
    holeRootRef.current = holeEl;
  }, [holeEl]);

  const inViewOptions = useMemo(
    () => ({
      root: holeRootRef,
      amount: 0.28 as const,
    }),
    [],
  );

  useEffect(() => {
    const html = document.documentElement;
    html.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";

    return () => {
      html.style.overscrollBehaviorY = "";
      document.body.style.overscrollBehaviorY = "";
    };
  }, []);

  return (
    <>
      <div className="relative z-10 w-full min-w-0">
        {ABOUT_SNAP_SECTIONS.map((section, index) => {
          const slide = (
            <AboutSnapSlide section={section} />
          );

          if (index === 0) {
            return (
              <section
                key={section.id}
                id={`about-${section.id}`}
                className={snapSectionClass}
                style={snapSectionStyle}
              >
                <h1 className="sr-only">About — {section.label}</h1>
                {slide}
              </section>
            );
          }

          return (
            <InView
              key={section.id}
              as="section"
              id={`about-${section.id}`}
              className={snapSectionClass}
              style={snapSectionStyle}
              variants={scrollReveal}
              viewOptions={inViewOptions}
              transition={inViewTransition}
            >
              <h2 className="sr-only">{section.label}</h2>
              {slide}
            </InView>
          );
        })}
      </div>

      <OrangeMidLine />

      <AboutViewportMask onHoleRef={setHoleEl} />
      <AboutSectionHeadings labels={SECTION_LABELS} activeIndex={activeIndex} />

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-45 w-full max-w-[min(100%,30rem)] -translate-x-1/2 px-4 sm:bottom-6 md:max-w-[34rem]">
        <div className="flex justify-center">
          <GlowingScrollIndicator direction="vertical" />
        </div>
      </div>
    </>
  );
}
