"use client";

import {
  ThemeToggleButton2,
  type ThemeToggleAnimation,
} from "@repo/ui/components/ui/skiper-ui/skiper4";

/** First toggle: bottom-up; next toggle: top-down; repeats. */
const THEME_ANIMATION: ThemeToggleAnimation = {
  variant: "rectangle",
  blur: true,
  alternateStarts: ["bottom-up", "top-down"],
};

export function FloatingThemeToggle() {
  return (
    <ThemeToggleButton2
      animation={THEME_ANIMATION}
      className="fixed right-4 bottom-4 z-70 size-6 sm:size-8 md:right-6 md:bottom-6 md:size-10"
    />
  );
}
