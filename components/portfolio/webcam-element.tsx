"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid"

const BLUE = "#18A0FB"

// Tunable grid config the user can play with from the inspector.
interface GridConfig {
  gridCols: number
  gridRows: number
  maxElevation: number
  motionSensitivity: number
  gapRatio: number
  darken: number
  colorMode: "webcam" | "monochrome"
  mirror: boolean
  invertColors: boolean
}

const DEFAULTS: GridConfig = {
  gridCols: 48,
  gridRows: 36,
  maxElevation: 26,
  motionSensitivity: 0.25,
  gapRatio: 0.06,
  darken: 0.5,
  colorMode: "webcam",
  mirror: true,
  invertColors: false,
}

// A raw Figma-board element: just the webcam pixel grid filling the frame. The
// surrounding CanvasFrame supplies the label, selection outline and dimensions,
// so there is no card chrome here. The camera (getUserMedia, inside
// WebcamPixelGrid's mount effect) only runs while this element is selected —
// it's mounted only when `interactive` is true, and unmounted (camera released)
// when you deselect.
export function WebcamElement({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const [cfg, setCfg] = useState<GridConfig>(DEFAULTS)

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <div className="absolute inset-0 overflow-hidden bg-neutral-950">
        {interactive ? (
          // Remount only when the grid resolution changes (re-acquires the
          // already-granted camera silently); live tweaks below don't remount.
          <WebcamPixelGrid
            key={`${cfg.gridCols}x${cfg.gridRows}`}
            gridCols={cfg.gridCols}
            gridRows={cfg.gridRows}
            maxElevation={cfg.maxElevation}
            motionSensitivity={cfg.motionSensitivity}
            elevationSmoothing={0.2}
            colorMode={cfg.colorMode}
            backgroundColor="#0a0a0a"
            mirror={cfg.mirror}
            gapRatio={cfg.gapRatio}
            darken={cfg.darken}
            invertColors={cfg.invertColors}
            borderColor={BLUE}
            borderOpacity={0.1}
            className="h-full w-full"
            onWebcamReady={() => posthog.capture("webcam_grid_ready")}
            onWebcamError={() => posthog.capture("webcam_grid_denied")}
          />
        ) : (
          // Inert state: a faint pixel grid so it still reads as a grid element,
          // with no camera touched.
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: "#0a0a0a",
              backgroundImage: `linear-gradient(${BLUE}1f 1px, transparent 1px), linear-gradient(90deg, ${BLUE}1f 1px, transparent 1px)`,
              backgroundSize: "13px 13px",
            }}
          />
        )}
      </div>

      {interactive && <Inspector cfg={cfg} setCfg={setCfg} />}
    </div>
  )
}

// Minimal Figma-style properties panel, anchored just outside the right edge.
function Inspector({
  cfg,
  setCfg,
}: {
  cfg: GridConfig
  setCfg: React.Dispatch<React.SetStateAction<GridConfig>>
}) {
  const set = <K extends keyof GridConfig>(key: K, value: GridConfig[K]) =>
    setCfg((c) => ({ ...c, [key]: value }))

  // Don't let control interaction start a canvas drag / deselect.
  const stop = (e: React.PointerEvent) => e.stopPropagation()

  return (
    <div
      onPointerDown={stop}
      className="absolute top-0 left-full z-20 ml-4 w-52 border border-gray-200/80 bg-white/85 px-4 py-3.5 shadow-sm backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/85"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-400 lowercase dark:text-neutral-500">
          <span aria-hidden className="h-3 w-[2px] rounded-full bg-[#18A0FB]" />
          config
        </span>
        <button
          type="button"
          onClick={() => setCfg(DEFAULTS)}
          className="font-mono text-[10px] tracking-wide text-neutral-300 transition-colors hover:text-[#18A0FB] dark:text-neutral-600"
        >
          reset
        </button>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <Stepper label="cols" value={cfg.gridCols} min={16} max={80} step={4} onChange={(v) => set("gridCols", v)} />
        <Stepper label="rows" value={cfg.gridRows} min={12} max={60} step={4} onChange={(v) => set("gridRows", v)} />
      </div>

      <Divider />

      <div className="flex flex-col gap-3">
        <Slider label="elevation" value={cfg.maxElevation} min={0} max={80} step={1} onChange={(v) => set("maxElevation", v)} />
        <Slider label="sensitivity" value={cfg.motionSensitivity} min={0.05} max={1} step={0.05} fixed={2} onChange={(v) => set("motionSensitivity", v)} />
        <Slider label="gap" value={cfg.gapRatio} min={0} max={0.3} step={0.02} fixed={2} onChange={(v) => set("gapRatio", v)} />
        <Slider label="darken" value={cfg.darken} min={0} max={0.9} step={0.05} fixed={2} onChange={(v) => set("darken", v)} />
      </div>

      <Divider />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className={microLabel}>color</span>
          <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-wide lowercase">
            {(["webcam", "mono"] as const).map((o) => {
              const on = o === "webcam" ? cfg.colorMode === "webcam" : cfg.colorMode === "monochrome"
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => set("colorMode", o === "webcam" ? "webcam" : "monochrome")}
                  className={cn(
                    "transition-colors",
                    on ? "text-[#18A0FB]" : "text-neutral-300 hover:text-neutral-500 dark:text-neutral-600"
                  )}
                >
                  {o}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Switch label="mirror" on={cfg.mirror} onClick={() => set("mirror", !cfg.mirror)} />
          <Switch label="invert" on={cfg.invertColors} onClick={() => set("invertColors", !cfg.invertColors)} />
        </div>
      </div>
    </div>
  )
}

const microLabel = "font-mono text-[10px] tracking-[0.1em] text-neutral-400 lowercase dark:text-neutral-500"
const valueLabel = "font-mono text-[10px] tabular-nums text-neutral-700 dark:text-neutral-200"

function Divider() {
  return <div className="my-3 h-px bg-gray-100 dark:bg-neutral-800" />
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  fixed = 0,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  fixed?: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between">
        <span className={microLabel}>{label}</span>
        <span className={valueLabel}>{value.toFixed(fixed)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="fig-slider text-gray-200 dark:text-neutral-700"
      />
    </label>
  )
}

// Borderless ± stepper for grid resolution (each click = one clean remount).
function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const btn =
    "font-mono text-[13px] leading-none text-neutral-300 transition-colors hover:text-[#18A0FB] disabled:opacity-30 disabled:hover:text-neutral-300 dark:text-neutral-600"
  return (
    <div className="flex items-center justify-between">
      <span className={microLabel}>{label}</span>
      <span className="flex items-center gap-3">
        <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(clamp(value - step))}>
          −
        </button>
        <span className={cn(valueLabel, "w-5 text-center")}>{value}</span>
        <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(clamp(value + step))}>
          +
        </button>
      </span>
    </div>
  )
}

function Switch({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] lowercase transition-colors",
        on ? "text-[#18A0FB]" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full transition-colors",
          on ? "bg-[#18A0FB]" : "bg-neutral-300 dark:bg-neutral-600"
        )}
      />
      {label}
    </button>
  )
}
