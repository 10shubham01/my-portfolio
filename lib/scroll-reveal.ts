/** Scroll reveal without `filter: blur()` — much cheaper on mobile GPUs. */
export const scrollRevealLight = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

export const scrollRevealHeavy = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

export const inViewTransitionLight = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const inViewTransitionHeavy = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1] as const,
};
