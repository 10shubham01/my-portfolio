"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { prefersLightMotion } from "@/lib/motion-capability";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

const SECTION_SELECTOR = ".about-snap-section";

/**
 * Full-page snap scroll hook powered by GSAP ScrollToPlugin.
 *
 * On touch-primary devices uses native scroll + IntersectionObserver so touch
 * is not blocked by `preventDefault` and long GSAP tweens do not fight momentum.
 */
export function useSnapScroll({
  sectionCount,
  duration = 0.85,
  ease = "power3.inOut",
  swipeThreshold = 50,
}: {
  sectionCount: number;
  duration?: number;
  ease?: string;
  swipeThreshold?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const cooldownRef = useRef(false);

  const scrollToSection = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), sectionCount - 1);
      if (clamped === activeRef.current && !animatingRef.current) return;

      activeRef.current = clamped;
      setActiveIndex(clamped);

      const target = document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)[clamped];
      if (!target) return;

      if (prefersLightMotion()) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      animatingRef.current = true;
      const targetY = clamped * window.innerHeight;

      gsap.killTweensOf(window, "scrollTo");

      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration,
        ease,
        overwrite: true,
        onComplete: () => {
          animatingRef.current = false;
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
          }, 100);
        },
      });
    },
    [sectionCount, duration, ease],
  );

  useEffect(() => {
    const nativeScroll = prefersLightMotion();
    const html = document.documentElement;

    if (nativeScroll) {
      html.dataset.aboutNativeScroll = "true";

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
      );
      if (sections.length === 0) return;

      const ratios = new Map<Element, number>();

      const pickActive = () => {
        let bestIndex = 0;
        let bestRatio = -1;

        sections.forEach((section, index) => {
          const ratio = ratios.get(section) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        if (bestIndex !== activeRef.current) {
          activeRef.current = bestIndex;
          setActiveIndex(bestIndex);
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target, entry.intersectionRatio);
          }
          pickActive();
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      sections.forEach((section) => observer.observe(section));
      pickActive();

      return () => {
        delete html.dataset.aboutNativeScroll;
        observer.disconnect();
      };
    }

    function getScrollablePanel(target: EventTarget | null): HTMLElement | null {
      if (!(target instanceof Element)) return null;
      const panel = target.closest(".about-section-panel");
      if (!(panel instanceof HTMLElement)) return null;
      return panel.scrollHeight > panel.clientHeight + 2 ? panel : null;
    }

    function panelConsumesWheel(panel: HTMLElement, deltaY: number): boolean {
      const atTop = panel.scrollTop <= 0;
      const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
      if (deltaY > 0) return !atBottom;
      if (deltaY < 0) return !atTop;
      return false;
    }

    function handleWheel(e: WheelEvent) {
      const panel = getScrollablePanel(e.target);
      if (panel && panelConsumesWheel(panel, e.deltaY)) return;

      e.preventDefault();
      if (animatingRef.current || cooldownRef.current) return;
      if (Math.abs(e.deltaY) < 5) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToSection(activeRef.current + dir);
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    function handleTouchMove(e: TouchEvent) {
      const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
      const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
      if (dy > dx && dy > 10) {
        e.preventDefault();
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (animatingRef.current || cooldownRef.current) return;
      const dy = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(dy) < swipeThreshold) return;
      const dir = dy > 0 ? 1 : -1;
      scrollToSection(activeRef.current + dir);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (animatingRef.current || cooldownRef.current) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          scrollToSection(activeRef.current + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          scrollToSection(activeRef.current - 1);
          break;
        case "Home":
          e.preventDefault();
          scrollToSection(0);
          break;
        case "End":
          e.preventDefault();
          scrollToSection(sectionCount - 1);
          break;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      gsap.killTweensOf(window);
    };
  }, [scrollToSection, swipeThreshold, sectionCount]);

  return { activeIndex, scrollToSection };
}
