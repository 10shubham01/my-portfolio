"use client";

/**
 * Opaque fixed band above the orange line so scrollable Work copy cannot bleed
 * through the spotlight tile (video + heading). Main content stays at z-10.
 */
export function WorkViewportMask() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] bg-background"
        style={{ height: "calc(var(--site-nav-h) + var(--about-mask-belt))" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 z-[80] bg-background"
        style={{
          top: "calc(var(--site-nav-h) + var(--about-mask-belt))",
          height: "calc(var(--about-fixed-line-top) - var(--site-nav-h) - var(--about-mask-belt))",
        }}
        aria-hidden
      />
    </>
  );
}
