"use client";

import type { ReactNode } from "react";

type AccordionPanelProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Height animation via CSS grid (0fr → 1fr). Respects prefers-reduced-motion.
 */
export function AccordionPanel({ open, children, className = "" }: AccordionPanelProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-(--expo-out) motion-reduce:transition-none ${className}`}
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      aria-hidden={!open}
    >
      <div
        className={`min-h-0 overflow-hidden transition-opacity duration-300 ease-(--expo-out) motion-reduce:transition-none ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
