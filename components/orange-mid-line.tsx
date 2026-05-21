import { cn } from "@repo/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

const ORANGE = "#FF5800";

type OrangeMidLineProps = ComponentPropsWithoutRef<"div">;

/**
 * Thin orange rule: solid base (always visible) + displaced SVG strokes (sketchy).
 */
export function OrangeMidLine({ className, style, ...rest }: OrangeMidLineProps) {
  return (
    <div
      className={cn(
        "orange-mid-line pointer-events-none fixed inset-x-0 z-[92] h-[5px] overflow-visible",
        className,
      )}
      style={{ top: "var(--about-fixed-line-top, 20dvh)", ...style }}
      aria-hidden
      {...rest}
    >
      <div className="orange-mid-line__base absolute inset-x-0 top-1/2 h-px -translate-y-1/2" aria-hidden />
      <div className="orange-mid-line__glow absolute inset-x-0 top-1/2 h-px -translate-y-1/2" aria-hidden />
      <svg
        className="orange-mid-line__svg absolute inset-0 block w-full overflow-visible"
        viewBox="0 0 100 5"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          className="orange-mid-line__stroke"
          x1={0}
          y1={2.5}
          x2={100}
          y2={2.5}
          stroke={ORANGE}
          strokeWidth={1.15}
          vectorEffect="non-scaling-stroke"
          filter="url(#site-rough-orange)"
        />
        <line
          className="orange-mid-line__stroke"
          x1={0.1}
          y1={2.72}
          x2={99.9}
          y2={2.72}
          stroke={ORANGE}
          strokeWidth={0.85}
          opacity={0.75}
          vectorEffect="non-scaling-stroke"
          filter="url(#site-rough-orange)"
        />
        <line
          className="orange-mid-line__stroke orange-mid-line__stroke--ghost"
          x1={0.2}
          y1={2.95}
          x2={99.8}
          y2={2.95}
          stroke={ORANGE}
          strokeWidth={0.55}
          strokeDasharray="0.9 1.8 0.5 1.2"
          opacity={0.42}
          vectorEffect="non-scaling-stroke"
          filter="url(#site-rough-border-b)"
        />
      </svg>
    </div>
  );
}
