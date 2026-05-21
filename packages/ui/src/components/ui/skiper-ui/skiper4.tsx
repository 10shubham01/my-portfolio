"use client";

import { motion } from "framer-motion";
import { useCallback, useId, useState } from "react";

import { cn } from "../../../lib/utils";
import { useThemeToggle, type AnimationStart, type AnimationVariant } from "./skiper26";

type ToggleProps = { className?: string };

export type ThemeToggleAnimation = {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  /** Alternates transition origin on each toggle (e.g. bottom-up, then top-down). */
  alternateStarts?: [AnimationStart, AnimationStart];
};

const DEFAULT_THEME_ANIMATION: ThemeToggleAnimation = {
  variant: "rectangle",
  blur: true,
  alternateStarts: ["bottom-up", "top-down"],
};

/**
 * Skiper4 - ThemeToggleButton2 style
 * Uses skiper26's useThemeToggle for actual theme switching.
 */
export function ThemeToggleButton2({
  className,
  animation = DEFAULT_THEME_ANIMATION,
}: ToggleProps & { animation?: ThemeToggleAnimation }) {
  const alternateStarts =
    animation.alternateStarts ?? DEFAULT_THEME_ANIMATION.alternateStarts;
  const [alternateIndex, setAlternateIndex] = useState(0);

  const transitionStart = alternateStarts
    ? alternateStarts[alternateIndex]
    : (animation.start ?? "bottom-up");

  const { isDark, toggleTheme: runToggle } = useThemeToggle({
    variant: animation.variant ?? DEFAULT_THEME_ANIMATION.variant,
    start: transitionStart,
    blur: animation.blur ?? DEFAULT_THEME_ANIMATION.blur,
  });

  const toggleTheme = useCallback(() => {
    runToggle();
    if (alternateStarts) {
      setAlternateIndex((index) => (index + 1) % alternateStarts.length);
    }
  }, [runToggle, alternateStarts]);

  const clipPathId = useId();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95",
        isDark ? "bg-black text-white" : "bg-white text-black",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
      >
        <clipPath id={clipPathId}>
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath={`url(#${clipPathId})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}

