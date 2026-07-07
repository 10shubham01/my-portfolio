"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Metrics = {
  fps: number
  /** Worst (longest) frame in the sampling window, in ms — surfaces jank. */
  worst: number
  domNodes: number
  /** Used JS heap in MB, or null when the browser doesn't expose it. */
  heapMb: number | null
}

type PerfMemory = { usedJSHeapSize: number }

type Rating = "good" | "needs-improvement" | "poor"
type Vital = { value: number; rating: Rating }
type Vitals = Partial<Record<Metric["name"], Vital>>

/** One-line plain-English gloss + "good" threshold for every metric shown. */
const METRIC_INFO: Record<string, { title: string; desc: string; good: string }> = {
  fps: {
    title: "FPS",
    desc: "Frames painted per second while you pan & zoom. Higher is smoother.",
    good: "60 = buttery",
  },
  "worst frame": {
    title: "Worst frame",
    desc: "Longest single frame in the last window. Big spikes are visible jank.",
    good: "< 16ms",
  },
  "visitors online": {
    title: "Visitors online",
    desc: "People sharing this canvas right now, over a Supabase realtime channel.",
    good: "live presence",
  },
  "live cursors": {
    title: "Live cursors",
    desc: "Other visitors' cursors streamed in — throttled to one update per 45ms.",
    good: "realtime",
  },
  "cards mounted": {
    title: "Cards mounted",
    desc: "React nodes rendered on the canvas, each pannable, zoomable & deep-linkable.",
    good: "all interactive",
  },
  zoom: {
    title: "Zoom",
    desc: "Current canvas scale, applied as a GPU translate3d + scale transform.",
    good: "0.1×–2.5×",
  },
  "dom nodes": {
    title: "DOM nodes",
    desc: "Total elements in the document. Fewer nodes = cheaper layout & paint.",
    good: "lean tree",
  },
  "js heap": {
    title: "JS heap",
    desc: "Live JavaScript memory in use (Chromium only). Watch for leaks over time.",
    good: "stable",
  },
  LCP: {
    title: "Largest Contentful Paint",
    desc: "Time until the biggest element (image/text block) is drawn — perceived load speed.",
    good: "< 2.5s",
  },
  FCP: {
    title: "First Contentful Paint",
    desc: "Time to the very first pixel of content. How fast the page feels to start.",
    good: "< 1.8s",
  },
  CLS: {
    title: "Cumulative Layout Shift",
    desc: "How much the layout jumps around during load. Lower means less visual shifting.",
    good: "< 0.1",
  },
  INP: {
    title: "Interaction to Next Paint",
    desc: "Slowest response between an interaction and the screen updating. Measures snappiness.",
    good: "< 200ms",
  },
  TTFB: {
    title: "Time to First Byte",
    desc: "How long the server took to send the first byte of the response.",
    good: "< 0.8s",
  },
}

const VITAL_ORDER: Metric["name"][] = ["LCP", "FCP", "CLS", "INP", "TTFB"]

/** Subscribes to the Web Vitals stream and keeps the latest reading per metric. */
function useWebVitals(): Vitals {
  const [vitals, setVitals] = useState<Vitals>({})

  useEffect(() => {
    const record = (metric: Metric) => {
      setVitals((current) => ({
        ...current,
        [metric.name]: { value: metric.value, rating: metric.rating },
      }))
    }
    // reportAllChanges: emit interim values so the HUD updates live, not just at unload.
    const opts = { reportAllChanges: true }
    onLCP(record, opts)
    onFCP(record, opts)
    onCLS(record, opts)
    onINP(record, opts)
    onTTFB(record, opts)
  }, [])

  return vitals
}

function formatMs(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`
}

function toneFromRating(rating: Rating): "good" | "warn" | "bad" {
  return rating === "good" ? "good" : rating === "needs-improvement" ? "warn" : "bad"
}

/**
 * Always-on "X-ray" perf badge. Collapsed, it's a tiny live FPS pill; expanded,
 * it turns the polished canvas inside-out and shows the engineering underneath —
 * real frame timing, live presence/render counts, DOM & heap footprint, and the
 * page's actual Core Web Vitals. Every value is measured live, none hardcoded.
 */
export function PerfHud({
  visitors,
  cursors,
  cards,
  zoom,
}: {
  visitors: number
  cursors: number
  cards: number
  zoom: number
}) {
  const [open, setOpen] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 60,
    worst: 16,
    domNodes: 0,
    heapMb: null,
  })
  const vitals = useWebVitals()

  // Frame timing: count frames + track the longest gap over a ~500ms window.
  useEffect(() => {
    let raf = 0
    let frames = 0
    let windowStart = performance.now()
    let last = windowStart
    let worst = 0

    const loop = (now: number) => {
      frames += 1
      worst = Math.max(worst, now - last)
      last = now

      const elapsed = now - windowStart
      if (elapsed >= 500) {
        const fps = Math.round((frames * 1000) / elapsed)
        const perf = performance as Performance & { memory?: PerfMemory }
        setMetrics({
          fps,
          worst: Math.round(worst),
          domNodes: document.getElementsByTagName("*").length,
          heapMb: perf.memory
            ? Math.round(perf.memory.usedJSHeapSize / 1048576)
            : null,
        })
        frames = 0
        worst = 0
        windowStart = now
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const tone =
    metrics.fps >= 55 ? "good" : metrics.fps >= 30 ? "warn" : "bad"
  const dotColor =
    tone === "good"
      ? "bg-emerald-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-red-500"

  return (
    <div
      className="fixed bottom-4 left-4 z-50 font-mono text-[11px]"
      onPointerDown={(event) => event.stopPropagation()}
    >
      {open ? (
        <div className="w-60 overflow-hidden rounded-lg border border-gray-200 bg-white/95 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-neutral-800">
            <span className="flex items-center gap-1.5 tracking-wide text-gray-500 dark:text-neutral-400">
              <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
              X-RAY · live perf
            </span>
            <div className="flex items-center gap-1.5">
              <GlossaryDialog />
              <button
                type="button"
                aria-label="Collapse perf panel"
                className="text-gray-400 transition-colors hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-200"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <dl className="divide-y divide-gray-100 dark:divide-neutral-800">
            <Row label="fps" value={String(metrics.fps)} tone={tone} />
            <Row label="worst frame" value={`${metrics.worst}ms`} />
            <Row label="visitors online" value={String(visitors)} />
            <Row label="live cursors" value={String(cursors)} />
            <Row label="cards mounted" value={String(cards)} />
            <Row label="zoom" value={`${Math.round(zoom * 100)}%`} />
            <Row label="dom nodes" value={metrics.domNodes.toLocaleString()} />
            {metrics.heapMb !== null ? (
              <Row label="js heap" value={`${metrics.heapMb}MB`} />
            ) : null}
          </dl>

          <div className="border-t border-gray-100 px-3 pt-1.5 pb-0.5 text-[9px] tracking-wide text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
            CORE WEB VITALS
          </div>
          <dl className="divide-y divide-gray-100 dark:divide-neutral-800">
            {VITAL_ORDER.map((name) => {
              const v = vitals[name]
              return (
                <Row
                  key={name}
                  label={name}
                  value={
                    v
                      ? name === "CLS"
                        ? v.value.toFixed(3)
                        : formatMs(v.value)
                      : "…"
                  }
                  tone={v ? toneFromRating(v.rating) : undefined}
                />
              )
            })}
          </dl>

          <p className="border-t border-gray-100 px-3 py-2 text-[10px] leading-relaxed text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
            60fps held via <span className="text-gray-600 dark:text-neutral-300">translate3d</span> transforms,{" "}
            <span className="text-gray-600 dark:text-neutral-300">willChange</span> hints &amp; a{" "}
            <span className="text-gray-600 dark:text-neutral-300">45ms-throttled</span> presence stream.
          </p>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Open live performance panel"
          title="Live perf — click for the X-ray view"
          className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/90 px-2 py-1 text-gray-600 shadow-sm backdrop-blur transition-colors hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:text-neutral-100"
          onClick={() => {
            setOpen(true)
            posthog.capture("perf_panel_opened", {
              fps: metrics.fps,
              visitors,
              cursors,
            })
          }}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
          {metrics.fps} fps
        </button>
      )}
    </div>
  )
}

/** Info button → centered modal glossary explaining every metric in the panel. */
function GlossaryDialog() {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) posthog.capture("perf_glossary_opened")
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="What do these metrics mean?"
          className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[9px] leading-none text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-700 dark:border-neutral-600 dark:text-neutral-500 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
        >
          i
        </button>
      </DialogTrigger>
      <DialogContent className="gap-4 rounded-lg font-mono sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>What am I looking at?</DialogTitle>
          <DialogDescription className="font-mono">
            Every number in the X-ray panel — measured live in your browser, none
            hardcoded.
          </DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {Object.entries(METRIC_INFO).map(([key, info]) => (
            <div key={key}>
              <dt className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] text-gray-900 dark:text-neutral-100">
                  {info.title}
                </span>
                <span className="shrink-0 text-[10px] text-emerald-600 dark:text-emerald-400">
                  {info.good}
                </span>
              </dt>
              <dd className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-neutral-400">
                {info.desc}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "good" | "warn" | "bad"
}) {
  const valueColor =
    tone === "warn"
      ? "text-amber-600 dark:text-amber-400"
      : tone === "bad"
        ? "text-red-600 dark:text-red-400"
        : tone === "good"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-gray-900 dark:text-neutral-100"

  return (
    <div className="flex items-center justify-between px-3 py-1.5">
      <dt className="text-gray-500 dark:text-neutral-400">{label}</dt>
      <dd className={cn("tabular-nums", valueColor)}>{value}</dd>
    </div>
  )
}
