/** Shared SVG filters for sketchy borders (viewport frame + .rough-border). */
export function RoughBorderDefs() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed h-px w-px overflow-hidden opacity-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="site-rough-border-a"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045 0.08"
            numOctaves={3}
            seed={4}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.8} />
        </filter>
        <filter
          id="site-rough-border-b"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06 0.11"
            numOctaves={2}
            seed={19}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.6} />
        </filter>
        <filter
          id="site-rough-stroke-light"
          x="-10%"
          y="-40%"
          width="120%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.12"
            numOctaves={2}
            seed={8}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.15} />
        </filter>
        <filter
          id="site-rough-orange"
          x="-4%"
          y="-400%"
          width="108%"
          height="900%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.052 0.22"
            numOctaves={3}
            seed={11}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.8} />
        </filter>
        <filter
          id="site-rough-block"
          x="-28%"
          y="-28%"
          width="156%"
          height="156%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2 0.2"
            numOctaves={3}
            seed={6}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={5.2} />
        </filter>
      </defs>
    </svg>
  );
}
