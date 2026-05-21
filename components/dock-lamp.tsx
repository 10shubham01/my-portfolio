"use client";

import { usePathname } from "next/navigation";

export function DockLamp() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      aria-hidden
      className="dock-lamp dock-lamp--home pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
