"use client"

import { MiniSpiderMan } from "@/components/portfolio/spiderman-figure"
import type {
  PresenceMember,
  RemoteCursor,
} from "@/components/portfolio/use-canvas-presence"

/**
 * Renders remote visitors as mini Spider-Men. Mounted INSIDE the transformed
 * canvas, so each sits at its canvas-space coordinate and pans/zooms with the
 * board. The inner wrapper counter-scales (1 / zoom) so the figure and label
 * stay a constant on-screen size — same trick as `.canvas-label`.
 */
export function CanvasCursors({ cursors }: { cursors: RemoteCursor[] }) {
  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="pointer-events-none absolute top-0 left-0 z-[120]"
          style={{
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
            transition: "transform 90ms linear",
          }}
        >
          <div style={{ transform: "scale(calc(1 / var(--canvas-zoom, 1)))", transformOrigin: "0 0" }}>
            {/* nudge so the figure's head sits near the actual pointer coordinate */}
            <div style={{ transform: "translate(-7px, -3px)" }}>
              <MiniSpiderMan size={30} accent={cursor.color} />
            </div>
            <span
              className="absolute top-1 left-7 rounded-full px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Replaces the plain "N online" badge: every visitor currently exploring is a
 * mini Spider-Man dangling on a web thread in the top-left corner — yours
 * highlighted, names on hover. Thread lengths and sway are staggered.
 */
export function PresenceWeb({ members }: { members: PresenceMember[] }) {
  if (members.length <= 1) return null

  const shown = members.slice(0, 8)
  const overflow = members.length - shown.length

  return (
    <div
      className="fixed top-0 left-6 z-50 flex items-start gap-2"
      title={`${members.length} exploring now`}
    >
      {shown.map((member, index) => {
        const threadLength = 24 + (index % 4) * 12
        return (
          <div
            key={member.id}
            className="presence-dangle group relative flex flex-col items-center"
            style={{ animationDelay: `${(index % 5) * 0.4}s` }}
          >
            <span
              className="w-px shrink-0"
              style={{ height: threadLength, background: "rgba(150,150,160,0.6)" }}
            />
            <div
              className="relative -mt-0.5 rounded-full"
              style={member.self ? { boxShadow: `0 0 0 2px ${member.color}` } : undefined}
            >
              <MiniSpiderMan size={26} accent={member.color} />
            </div>
            <span className="pointer-events-none absolute top-full mt-1 hidden whitespace-nowrap rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-white group-hover:block dark:bg-neutral-100 dark:text-neutral-900">
              {member.self ? "you" : member.name}
            </span>
          </div>
        )
      })}

      {overflow > 0 ? (
        <div className="presence-dangle flex flex-col items-center" style={{ animationDelay: "1.6s" }}>
          <span className="w-px shrink-0" style={{ height: 30, background: "rgba(150,150,160,0.6)" }} />
          <span className="-mt-0.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
            +{overflow}
          </span>
        </div>
      ) : null}
    </div>
  )
}
