"use client";

import { useEffect, useState } from "react";

/**
 * True touch-first phones — not touch laptops / tablet+desktop widths.
 * `(pointer: coarse)` alone matches any touchscreen, which breaks desktop animations.
 */
export const MOBILE_PERF_MEDIA = "(max-width: 767px) and (hover: none) and (pointer: coarse)";

/** Scroll hijacking + lighter paints — does not disable text/section animations. */
export function prefersMobilePerf(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_PERF_MEDIA).matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersMobilePerf(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_PERF_MEDIA);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}

/** @deprecated Use prefersMobilePerf — old name was too aggressive. */
export function prefersLightMotion(): boolean {
  return prefersMobilePerf();
}

/** @deprecated Use usePrefersMobilePerf */
export function usePrefersLightMotion(): boolean {
  return usePrefersMobilePerf();
}
