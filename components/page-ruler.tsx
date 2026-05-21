"use client";

import { useEffect, useId, useState } from "react";

import { ROUGH_BORDER, ROUGH_BORDER_R, ROUGH_BORDER_T } from "@/lib/rough-border";

/** Keep in sync with `--page-ruler-size` in app/globals.css */
export const PAGE_RULER_SIZE = 11;
const MINOR_STEP = 10;
const MAJOR_STEP = 100;
const LABEL_EVERY = 100;

type Viewport = { width: number; height: number };

function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
}

function buildTicks(length: number) {
  const ticks: { pos: number; major: boolean; label?: string }[] = [];
  const end = Math.ceil(length / MINOR_STEP) * MINOR_STEP;

  for (let pos = 0; pos <= end; pos += MINOR_STEP) {
    const major = pos % MAJOR_STEP === 0;
    ticks.push({
      pos,
      major,
      label: major && pos % LABEL_EVERY === 0 ? String(pos) : undefined,
    });
  }

  return ticks;
}

function HorizontalRuler({ length }: { length: number }) {
  const id = useId();
  const ticks = buildTicks(length);

  if (length <= 0) return null;

  return (
    <svg
      aria-hidden
      width={length}
      height={PAGE_RULER_SIZE}
      className="page-ruler-svg block max-w-full shrink-0"
    >
      <line
        x1={0}
        y1={PAGE_RULER_SIZE - 0.5}
        x2={length}
        y2={PAGE_RULER_SIZE - 0.5}
        stroke="currentColor"
        strokeWidth={0.5}
      />
      {ticks.map(({ pos, major, label }) => (
        <g key={`${id}-h-${pos}`}>
          <line
            x1={pos}
            y1={PAGE_RULER_SIZE - 0.5}
            x2={pos}
            y2={major ? 2 : 5}
            stroke="currentColor"
            strokeWidth={0.5}
          />
          {label ? (
            <text
              x={pos + 2}
              y={7}
              fill="currentColor"
              fontSize={7}
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              className="select-none"
            >
              {label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function VerticalRuler({ length }: { length: number }) {
  const id = useId();
  const ticks = buildTicks(length);

  if (length <= 0) return null;

  return (
    <svg
      aria-hidden
      width={PAGE_RULER_SIZE}
      height={length}
      className="page-ruler-svg block max-h-full shrink-0"
    >
      <line
        x1={PAGE_RULER_SIZE - 0.5}
        y1={0}
        x2={PAGE_RULER_SIZE - 0.5}
        y2={length}
        stroke="currentColor"
        strokeWidth={0.5}
      />
      {ticks.map(({ pos, major, label }) => (
        <g key={`${id}-v-${pos}`}>
          <line
            x1={PAGE_RULER_SIZE - 0.5}
            y1={pos}
            x2={major ? 2 : 5}
            y2={pos}
            stroke="currentColor"
            strokeWidth={0.5}
          />
          {label ? (
            <text
              x={PAGE_RULER_SIZE - 2}
              y={pos}
              fill="currentColor"
              fontSize={7}
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              className="select-none"
              textAnchor="end"
              transform={`rotate(-90 ${PAGE_RULER_SIZE - 2} ${pos})`}
            >
              {label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

export function PageRuler() {
  const { width, height } = useViewport();
  const horizontalLength = Math.max(0, width - PAGE_RULER_SIZE);
  const verticalLength = Math.max(0, height - PAGE_RULER_SIZE);

  if (width === 0 || height === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 select-none"
      aria-hidden
      data-page-ruler
    >
      <div
        className={`page-ruler-strip ${ROUGH_BORDER} rb-ruler absolute top-0 left-0`}
        style={{ width: PAGE_RULER_SIZE, height: PAGE_RULER_SIZE }}
      />
      <div
        className={`page-ruler-strip ${ROUGH_BORDER_T} rb-ruler absolute top-0 right-0 left-0 overflow-hidden`}
        style={{ height: PAGE_RULER_SIZE, paddingLeft: PAGE_RULER_SIZE }}
      >
        <HorizontalRuler length={horizontalLength} />
      </div>
      <div
        className={`page-ruler-strip ${ROUGH_BORDER_R} rb-ruler absolute top-0 bottom-0 left-0 overflow-hidden`}
        style={{ width: PAGE_RULER_SIZE, paddingTop: PAGE_RULER_SIZE }}
      >
        <VerticalRuler length={verticalLength} />
      </div>
    </div>
  );
}
