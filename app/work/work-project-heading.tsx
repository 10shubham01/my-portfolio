"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AlienText } from "@/components/alien-text";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type WorkProjectHeadingProps = {
  label: string;
  activeIndex: number;
  wrap?: boolean;
};

export function WorkProjectHeading({ label, activeIndex, wrap = false }: WorkProjectHeadingProps) {
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const previous = prevIndexRef.current;
    setDirection(activeIndex >= previous ? 1 : -1);
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div
      data-work-project-heading="true"
      className="relative flex h-full w-full items-end justify-end pb-3 pr-1 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:pb-4 md:pr-2"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeIndex}-${label}`}
          initial={{ opacity: 0, y: direction > 0 ? -28 : 28, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: direction > 0 ? 28 : -28, filter: "blur(14px)" }}
          transition={{ duration: 0.52, ease: EASE }}
          className={cn(
            "pointer-events-auto absolute right-0 bottom-0 max-w-full text-right font-oblique tracking-tight text-foreground",
            wrap
              ? "leading-[1.1] text-[clamp(0.95rem,3.8vw,1.65rem)] sm:text-xl md:text-2xl"
              : "truncate text-[clamp(1rem,5.2vw,1.25rem)] sm:text-2xl md:text-3xl",
          )}
          aria-label={`${label}.`}
          aria-live="polite"
        >
          <AlienText text={label} wrap={wrap} />
          <span style={{ color: "#FF5800" }}>.</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
