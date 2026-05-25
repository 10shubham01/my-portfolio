"use client";

import { useEffect, useState } from "react";

/** Touch-first or reduced-motion: skip heavy blur, letter scramble, and scroll hijacking. */
export function prefersLightMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function usePrefersLightMotion(): boolean {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLight(coarse.matches || reduced.matches);
    sync();
    coarse.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return light;
}
