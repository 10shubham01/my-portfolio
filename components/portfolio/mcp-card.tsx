"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Check, Copy } from "lucide-react"
import posthog from "posthog-js"
import {
  CardSectionTitle,
  CardSurface,
  cardBodyClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"
import { notifyActivity } from "@/lib/notify"
import { SITE } from "@/lib/canvas-data"

const MCP_URL = `${SITE.url}/api/mcp`

const SNIPPETS = [
  { id: "endpoint", label: "ENDPOINT", value: MCP_URL },
  {
    id: "claude-code",
    label: "CLAUDE CODE",
    value: `claude mcp add --transport http shubham ${MCP_URL}`,
  },
  {
    id: "cursor",
    label: "CURSOR",
    value: `{ "mcpServers": { "shubham": { "url": "${MCP_URL}" } } }`,
  },
]

type ScriptLine = {
  text: string
  className: string
  /** ms to hold after the line finishes typing. */
  pause?: number
  /** Render fully at once instead of typing (tool-call spinner lines). */
  instant?: boolean
}

// One looping terminal take: connect, ask, watch the tools fire, get the
// verdict. The joke is the pitch — an AI agent literally recommends hiring.
const SCRIPT: ScriptLine[] = [
  {
    text: "$ claude mcp add shubham shubhamgupta.dev/api/mcp",
    className: "text-neutral-100",
    pause: 500,
  },
  { text: "✓ connected · 9 tools available", className: "text-emerald-400", pause: 900, instant: true },
  { text: "", className: "", pause: 100, instant: true },
  { text: '> should I hire Shubham?', className: "text-[#18A0FB]", pause: 600 },
  { text: "⏺ get_experience()", className: "text-neutral-500", pause: 450, instant: true },
  { text: "⏺ list_projects()", className: "text-neutral-500", pause: 450, instant: true },
  { text: "⏺ get_awards()", className: "text-neutral-500", pause: 600, instant: true },
  {
    text: "Yes — 5 yrs shipping fast web products, leads teams,",
    className: "text-amber-200",
    pause: 0,
  },
  {
    text: "mentors humans and AIs alike. Strong hire.",
    className: "text-amber-200",
    pause: 1200,
  },
  { text: "⏺ send_message(\"let's talk\")", className: "text-neutral-500", pause: 5000, instant: true },
]

const TYPE_MS = 28

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}

// Typewriter over SCRIPT: `line` is the line being revealed, `char` how much
// of it is visible. Runs on chained timeouts so unmount cleanly cancels it.
function useTerminalScript(animate: boolean) {
  const [progress, setProgress] = useState({ line: 0, char: 0 })

  useEffect(() => {
    if (!animate) return

    const current = SCRIPT[progress.line]
    if (!current) {
      const timer = setTimeout(() => setProgress({ line: 0, char: 0 }), 400)
      return () => clearTimeout(timer)
    }

    const done = current.instant || progress.char >= current.text.length
    const timer = setTimeout(
      () =>
        setProgress((prev) =>
          done ? { line: prev.line + 1, char: 0 } : { ...prev, char: prev.char + 1 }
        ),
      done ? (current.pause ?? 300) : TYPE_MS
    )
    return () => clearTimeout(timer)
  }, [animate, progress])

  return progress
}

function CopyChip({ id, label, value }: { id: string; label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      posthog.capture("mcp_snippet_copied", { snippet: id })
      notifyActivity("share", { target: `mcp ${id}` })
    } catch {
      // Clipboard denied — nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={value}
      aria-label={`Copy ${label.toLowerCase()}`}
      className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-medium tracking-wide text-[#18A0FB] transition-colors hover:opacity-80"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "COPIED" : `[ ${label} ]`}
    </button>
  )
}

// "Connect your AI" — the portfolio doubles as an MCP server (app/api/
// [transport]/route.ts). The card sells it the way a dev would meet it: a
// terminal replaying an agent connecting, interrogating the tools, and
// arriving at the only correct conclusion.
export function McpCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const reducedMotion = useReducedMotion()
  const { line, char } = useTerminalScript(!reducedMotion)

  const visibleLines = reducedMotion
    ? SCRIPT.map((entry) => ({ entry, text: entry.text, typing: false }))
    : SCRIPT.slice(0, line + 1).map((entry, index) => ({
        entry,
        text:
          index < line || entry.instant ? entry.text : entry.text.slice(0, char),
        typing: index === line,
      }))

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <CardSectionTitle>Connect your AI</CardSectionTitle>

      <p className={`mt-4 ${cardBodyClass}`}>
        This portfolio is also an MCP server. Plug it into your agent and
        interview me without me.
      </p>

      {/* Terminal stays dark in both themes — it's a terminal. Fixed height so
          the looping script never resizes the card. */}
      <div className="mt-5 overflow-hidden rounded-md border border-neutral-700/80 bg-neutral-950 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-neutral-800 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 truncate font-mono text-[10px] text-neutral-500">
            agent@anywhere — connected to shubham
          </span>
        </div>

        <div
          aria-hidden
          className="h-[228px] space-y-1 overflow-hidden px-3 py-3 font-mono text-[11px] leading-[1.6]"
        >
          {visibleLines.map(({ entry, text, typing }, index) => (
            <div key={index} className={entry.className}>
              {text}
              {typing && !entry.instant && (
                <span className="ml-px inline-block h-[12px] w-[6px] translate-y-[2px] animate-pulse bg-neutral-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">
        An AI agent connects to this portfolio over MCP, calls get_experience,
        list_projects, and get_awards, and concludes: strong hire.
      </p>

      <div className="mt-5 flex items-center justify-between gap-2">
        {SNIPPETS.map((snippet) => (
          <CopyChip key={snippet.id} {...snippet} />
        ))}
      </div>

      <p className="mt-3 font-mono text-[10px] text-gray-400 dark:text-neutral-500">
        streamable http · no auth · works with claude, cursor, or any mcp client
      </p>
    </CardSurface>
  )
}
