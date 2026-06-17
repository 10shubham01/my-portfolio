"use client"

import type {
  PresenceMember,
  RemoteCursor,
} from "@/components/portfolio/use-canvas-presence"

function CursorArrow({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2 2l5.5 13 2.2-5.3L15 7.5 2 2z"
        fill={color}
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Renders remote visitors' cursors. Mounted INSIDE the transformed canvas, so
 * each cursor sits at its canvas-space coordinate and pans/zooms with the
 * board. The inner wrapper counter-scales (1 / zoom) so the arrow and label
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
          <div
            style={{
              transform: "scale(calc(1 / var(--canvas-zoom, 1)))",
              transformOrigin: "0 0",
            }}
          >
            <CursorArrow color={cursor.color} />
            <span
              className="absolute top-4 left-3 rounded-full px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white shadow-sm"
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

function SpiderGlyph({ color }: { color: string }) {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden>
      <g stroke={color} strokeWidth="1.3" strokeLinecap="round">
        {/* legs */}
        <path d="M11 11 L4 7 M11 12 L3 11 M11 13 L4 16 M11 14 L6 19" />
        <path d="M13 11 L20 7 M13 12 L21 11 M13 13 L20 16 M13 14 L18 19" />
      </g>
      <ellipse cx="12" cy="13" rx="3.6" ry="4.4" fill={color} />
      <circle cx="12" cy="7.5" r="2.6" fill={color} />
    </svg>
  )
}

/**
 * Replaces the plain "N online" badge: every visitor currently exploring is a
 * spider dangling on a web thread in the top-left corner — yours highlighted,
 * names on hover. Thread lengths and sway are staggered so it feels alive.
 */
export function PresenceWeb({ members }: { members: PresenceMember[] }) {
  if (members.length <= 1) return null

  const shown = members.slice(0, 8)
  const overflow = members.length - shown.length

  return (
    <div
      className="fixed top-0 left-6 z-50 flex items-start gap-3"
      title={`${members.length} exploring now`}
    >
      {shown.map((member, index) => {
        const threadLength = 30 + (index % 4) * 11
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
            <div className="relative -mt-0.5">
              <SpiderGlyph color={member.color} />
              {member.self ? (
                <span
                  className="absolute -inset-1 rounded-full"
                  style={{ boxShadow: `0 0 0 1.5px ${member.color}55` }}
                />
              ) : null}
            </div>
            <span className="pointer-events-none absolute top-full mt-1 hidden whitespace-nowrap rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-white group-hover:block dark:bg-neutral-100 dark:text-neutral-900">
              {member.self ? "you" : member.name}
            </span>
          </div>
        )
      })}

      {overflow > 0 ? (
        <div className="presence-dangle flex flex-col items-center" style={{ animationDelay: "1.6s" }}>
          <span className="w-px shrink-0" style={{ height: 34, background: "rgba(150,150,160,0.6)" }} />
          <span className="-mt-0.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
            +{overflow}
          </span>
        </div>
      ) : null}
    </div>
  )
}
