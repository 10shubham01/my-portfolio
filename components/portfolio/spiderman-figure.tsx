import { useId } from "react"

const BLACK = "#161616"
const WHITE = "#f6f9ff"

export type SpideyLook = { x: number; y: number }

/**
 * Gradient definitions that give the suit volume (light → shadow across each
 * form). Scoped per-svg; the mascot renders one instance so ids are unique.
 */
function SuitGradients({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-red`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff5d5d" />
        <stop offset="45%" stopColor="#e02b2b" />
        <stop offset="100%" stopColor="#9c1414" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-blue`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4f8bef" />
        <stop offset="50%" stopColor="#2a5fd0" />
        <stop offset="100%" stopColor="#102a72" />
      </linearGradient>
      <radialGradient id={`${idPrefix}-head`} cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#ff6363" />
        <stop offset="55%" stopColor="#df2a2a" />
        <stop offset="100%" stopColor="#8f1212" />
      </radialGradient>
    </defs>
  )
}

export function SpiderManFigure({
  hovered,
  dragging,
  mood = "idle",
  look = { x: 0, y: 0 },
  blink = false,
}: {
  hovered: boolean
  dragging: boolean
  mood?: "idle" | "excited" | "dance" | "peek" | "swing"
  /** Normalized direction (-1..1) from Spidey toward the cursor. */
  look?: SpideyLook
  blink?: boolean
}) {
  const eyeGlow =
    (hovered && !dragging) || mood === "excited" || mood === "dance" || mood === "swing"
      ? "url(#eye-glow)"
      : undefined

  const moodClass =
    mood === "dance"
      ? "origin-center animate-bounce"
      : mood === "excited"
        ? "origin-center scale-110"
        : mood === "peek"
          ? "origin-center -rotate-6"
          : mood === "swing"
            ? "origin-center -rotate-[14deg]"
            : ""

  // Only breathe / sway when genuinely idle so it doesn't fight mood transforms.
  const alive = mood === "idle" && !dragging

  // Head leans toward the cursor; eyes track a little further.
  const headTilt = look.x * 5
  const eyeShiftX = look.x * 1.6
  const eyeShiftY = look.y * 1.2

  const eyeTransition = "transform 140ms ease-out"

  const red = "url(#sm-red)"
  const blue = "url(#sm-blue)"
  const head = "url(#sm-head)"

  return (
    <g transform="translate(100, 100)" aria-hidden>
      <SuitGradients idPrefix="sm" />
      <g className={moodClass}>
        <g className={alive ? "spidey-breathe" : undefined}>
          {/* ---- LEGS (blue thighs, red boots) ---- */}
          <path
            d="M-5 12 C-7 19 -9.5 26 -10 31 C-10.2 33 -13.5 33.4 -14.2 31.4 C-13.4 24 -11 16 -7.5 11 Z"
            fill={blue}
            stroke="#0c2566"
            strokeWidth={0.5}
          />
          <path
            d="M5 12 C7 19 9.5 26 10 31 C10.2 33 13.5 33.4 14.2 31.4 C13.4 24 11 16 7.5 11 Z"
            fill={blue}
            stroke="#0c2566"
            strokeWidth={0.5}
          />
          <path d="M-14.4 30.5 C-16.6 31.4 -16.8 35.4 -13.4 36 C-10.8 36.3 -9.6 33.6 -9.6 31.4 Z" fill={red} stroke="#6a0f0f" strokeWidth={0.5} />
          <path d="M14.4 30.5 C16.6 31.4 16.8 35.4 13.4 36 C10.8 36.3 9.6 33.6 9.6 31.4 Z" fill={red} stroke="#6a0f0f" strokeWidth={0.5} />

          {/* ---- LEFT ARM (blue), sways while idle ---- */}
          <g
            className={alive ? "spidey-limb-sway" : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "85% 8%" }}
          >
            <path
              d="M-8.5 -3 C-13.5 -1 -17.5 4 -18.8 10 C-19.1 12 -16.2 12.6 -15.2 10.6 C-13.8 5.6 -11.4 1.6 -8 -0.6 Z"
              fill={blue}
              stroke="#0c2566"
              strokeWidth={0.5}
            />
            <ellipse cx={-18.4} cy={11.6} rx={3.7} ry={4.1} fill={red} stroke="#6a0f0f" strokeWidth={0.5} />
          </g>

          {/* ---- RIGHT ARM (blue), counter-phase sway ---- */}
          <g
            className={alive ? "spidey-limb-sway" : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "15% 8%", animationDirection: "reverse" }}
          >
            <path
              d="M8.5 -3 C13.5 -1 17.5 4 18.8 10 C19.1 12 16.2 12.6 15.2 10.6 C13.8 5.6 11.4 1.6 8 -0.6 Z"
              fill={blue}
              stroke="#0c2566"
              strokeWidth={0.5}
            />
            <ellipse cx={18.4} cy={11.6} rx={3.7} ry={4.1} fill={red} stroke="#6a0f0f" strokeWidth={0.5} />
          </g>

          {/* ---- TORSO ---- */}
          <path
            d="M-9.5 -3.5 C-11 0.5 -10 8 -6.5 13.5 C-3 15.5 3 15.5 6.5 13.5 C10 8 11 0.5 9.5 -3.5 C5 -6 -5 -6 -9.5 -3.5 Z"
            fill={red}
            stroke="#6a0f0f"
            strokeWidth={0.5}
          />
          {/* form shadow + highlight for volume */}
          <path d="M9.5 -3.5 C11 0.5 10 8 6.5 13.5 C5.6 14 4.8 14.3 4 14.5 C7.6 8.5 8.6 1 7 -3.8 Z" fill="rgba(0,0,0,0.16)" />
          <ellipse cx={-2.5} cy={1} rx={4.6} ry={6} fill="rgba(255,255,255,0.12)" />
          {/* chest web lines */}
          <path
            d="M0 -4 L0 13 M-7.5 -0.5 C-3 -2.5 3 -2.5 7.5 -0.5 M-8 5.5 C-3 2.5 3 2.5 8 5.5"
            stroke={BLACK}
            strokeWidth={0.4}
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
          />

          {/* ---- CHEST SPIDER EMBLEM ---- */}
          <g transform="translate(0,3.5)" fill={BLACK}>
            <ellipse cx={0} cy={1.4} rx={1.9} ry={2.7} />
            <circle cx={0} cy={-1.6} r={1.2} />
            <g stroke={BLACK} strokeWidth={0.7} strokeLinecap="round" fill="none">
              <path d="M-0.6 0 C-3 -1 -4.5 -2.4 -5.4 -3.6 M-0.6 1 C-3.2 0.6 -5 0.2 -6 -0.4 M-0.6 2 C-3 2.4 -4.6 3.4 -5.4 4.4" />
              <path d="M0.6 0 C3 -1 4.5 -2.4 5.4 -3.6 M0.6 1 C3.2 0.6 5 0.2 6 -0.4 M0.6 2 C3 2.4 4.6 3.4 5.4 4.4" />
            </g>
          </g>

          {/* ---- NECK ---- */}
          <path d="M-3 -7 L3 -7 L3.4 -3.2 L-3.4 -3.2 Z" fill="#a51d1d" />

          {/* ---- HEAD (tilts toward cursor) ---- */}
          <g
            style={{
              transform: `rotate(${headTilt}deg)`,
              transformBox: "fill-box",
              transformOrigin: "50% 92%",
              transition: eyeTransition,
            }}
          >
            <path
              d="M0 -32 C8.6 -32 12.6 -26.5 12.6 -19.4 C12.6 -12.3 7 -7.4 0 -6.4 C-7 -7.4 -12.6 -12.3 -12.6 -19.4 C-12.6 -26.5 -8.6 -32 0 -32 Z"
              fill={head}
              stroke="#5e0c0c"
              strokeWidth={0.6}
            />
            {/* head highlight */}
            <ellipse cx={-4} cy={-24} rx={4.2} ry={5.4} fill="rgba(255,255,255,0.16)" />
            {/* head web */}
            <g stroke={BLACK} strokeWidth={0.4} fill="none" opacity={0.5} strokeLinecap="round">
              <path d="M0 -31 L0 -7.5" />
              <path d="M0 -31 C-5 -27 -9 -22 -11 -16" />
              <path d="M0 -31 C5 -27 9 -22 11 -16" />
              <path d="M0 -31 C-3 -28 -6.5 -25 -8.5 -21" />
              <path d="M0 -31 C3 -28 6.5 -25 8.5 -21" />
              <path d="M-8.5 -22 C-3 -25 3 -25 8.5 -22" />
              <path d="M-11 -15 C-4 -19 4 -19 11 -15" />
            </g>

            {/* ---- EYES (track cursor + blink) ---- */}
            <g
              style={{
                transform: `translate(${eyeShiftX}px, ${eyeShiftY}px) scaleY(${blink ? 0.12 : 1})`,
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: blink ? "transform 80ms ease-in" : eyeTransition,
              }}
            >
              <path
                d="M-1.1 -18 C-3.5 -22 -7.5 -23 -9.5 -21 C-10.5 -19.4 -9.1 -16.6 -6.5 -16 C-4.1 -15.8 -2.1 -16.6 -1.1 -18 Z"
                fill={WHITE}
                stroke={BLACK}
                strokeWidth={0.9}
                strokeLinejoin="round"
                filter={eyeGlow}
                className="transition-[filter] duration-300"
              />
              <path
                d="M1.1 -18 C3.5 -22 7.5 -23 9.5 -21 C10.5 -19.4 9.1 -16.6 6.5 -16 C4.1 -15.8 2.1 -16.6 1.1 -18 Z"
                fill={WHITE}
                stroke={BLACK}
                strokeWidth={0.9}
                strokeLinejoin="round"
                filter={eyeGlow}
                className="transition-[filter] duration-300"
              />
              {/* glossy eye highlights */}
              <ellipse cx={-6.5} cy={-20} rx={1.5} ry={1} fill="#eaf2ff" />
              <ellipse cx={6.5} cy={-20} rx={1.5} ry={1} fill="#eaf2ff" />
            </g>
          </g>
        </g>
      </g>
    </g>
  )
}

/**
 * A compact, shaded Spider-Man used for realtime visitors (cursors + the
 * presence web). `accent` tints a soft glow ring so each visitor is
 * distinguishable while the suit stays recognizably Spidey.
 */
export function MiniSpiderMan({ size = 30, accent }: { size?: number; accent?: string }) {
  // Unique per instance so an unmounting cursor can't strip the shared gradient.
  const id = "sm" + useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg
      width={size}
      height={(size * 40) / 32}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
      style={{ display: "block", filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" }}
    >
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5d5d" />
          <stop offset="55%" stopColor="#df2a2a" />
          <stop offset="100%" stopColor="#9c1414" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f8bef" />
          <stop offset="100%" stopColor="#142f78" />
        </linearGradient>
      </defs>

      {accent ? <circle cx="16" cy="18" r="15" fill={accent} opacity="0.14" /> : null}

      {/* legs + boots */}
      <path d="M13 24 C12 29 11 33 11 36 L8 36 C8 31 9 26 11 23 Z" fill={`url(#${id}-b)`} />
      <path d="M19 24 C20 29 21 33 21 36 L24 36 C24 31 23 26 21 23 Z" fill={`url(#${id}-b)`} />
      <ellipse cx="9" cy="36.5" rx="2.6" ry="2" fill={`url(#${id}-r)`} />
      <ellipse cx="23" cy="36.5" rx="2.6" ry="2" fill={`url(#${id}-r)`} />
      {/* arms */}
      <path d="M9 14 C5 16 2.5 20 2 24 C4 25 5.5 24 6 22 C7 19 8 17 10 15 Z" fill={`url(#${id}-b)`} />
      <path d="M23 14 C27 16 29.5 20 30 24 C28 25 26.5 24 26 22 C25 19 24 17 22 15 Z" fill={`url(#${id}-b)`} />
      <circle cx="2.5" cy="24.5" r="2.4" fill={`url(#${id}-r)`} />
      <circle cx="29.5" cy="24.5" r="2.4" fill={`url(#${id}-r)`} />
      {/* torso */}
      <path d="M9 12 C7.5 16 8 22 11 26 C13 27.5 19 27.5 21 26 C24 22 24.5 16 23 12 C19 9.5 13 9.5 9 12 Z" fill={`url(#${id}-r)`} />
      {/* emblem */}
      <ellipse cx="16" cy="18" rx="1.5" ry="2.1" fill={BLACK} />
      <circle cx="16" cy="15.4" r="1" fill={BLACK} />
      {/* head */}
      <path d="M16 1 C21 1 24 4.5 24 9 C24 13 20.5 15.6 16 16 C11.5 15.6 8 13 8 9 C8 4.5 11 1 16 1 Z" fill={`url(#${id}-r)`} stroke="#5e0c0c" strokeWidth="0.4" />
      {/* eyes */}
      <path d="M14 7 C11.5 5.3 8.5 6.6 8.9 9.6 C10.8 10.6 12.8 9.5 13.8 8.1 Z" fill={WHITE} stroke={BLACK} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M18 7 C20.5 5.3 23.5 6.6 23.1 9.6 C21.2 10.6 19.2 9.5 18.2 8.1 Z" fill={WHITE} stroke={BLACK} strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  )
}
