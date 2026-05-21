/** Fixed irregular frame on all viewport edges — sketchy / rough paper feel. */
export function RoughViewportBorder() {
  return (
    <div
      aria-hidden
      className="rough-viewport-border pointer-events-none fixed inset-0 z-[60] text-foreground/42 dark:text-foreground/22"
    >
      <svg
        className="size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className="rough-viewport-border__stroke"
          x="1.15"
          y="1.15"
          width="97.7"
          height="97.7"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.32}
          vectorEffect="non-scaling-stroke"
          filter="url(#site-rough-border-a)"
        />
        <rect
          className="rough-viewport-border__stroke rough-viewport-border__stroke--inner"
          x="1.55"
          y="1.55"
          width="96.9"
          height="96.9"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.2}
          strokeDasharray="0.6 1.1 0.35 0.9"
          opacity={0.55}
          vectorEffect="non-scaling-stroke"
          filter="url(#site-rough-border-b)"
        />
      </svg>
    </div>
  );
}
