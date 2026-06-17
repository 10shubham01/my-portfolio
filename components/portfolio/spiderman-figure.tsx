const RED = "#E23636"
const BLUE = "#1565C0"
const DARK_BLUE = "#0D47A1"
const BLACK = "#1a1a1a"
const WHITE = "#f8f8f8"

export type SpideyLook = { x: number; y: number }

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

  return (
    <g transform="translate(100, 100)" aria-hidden>
      <g className={moodClass}>
        <g className={alive ? "spidey-breathe" : undefined}>
          {/* Left arm */}
          <g
            className={alive ? "spidey-limb-sway" : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "90% 10%" }}
          >
            <path
              d="M-11 2 L-22 6 L-24 14 L-18 16 L-10 8 Z"
              fill={RED}
              stroke={BLACK}
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
            <path
              d="M-22 6 L-30 10 L-28 16 L-24 14 Z"
              fill={BLUE}
              stroke={DARK_BLUE}
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
            <ellipse cx={-30} cy={12} rx={3.5} ry={4} fill={RED} stroke={BLACK} strokeWidth={0.5} />
          </g>

          {/* Right arm (swayed in counter-phase) */}
          <g
            className={alive ? "spidey-limb-sway" : undefined}
            style={{
              transformBox: "fill-box",
              transformOrigin: "10% 10%",
              animationDirection: "reverse",
            }}
          >
            <path
              d="M11 2 L22 6 L24 14 L18 16 L10 8 Z"
              fill={RED}
              stroke={BLACK}
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
            <path
              d="M22 6 L30 10 L28 16 L24 14 Z"
              fill={BLUE}
              stroke={DARK_BLUE}
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
            <ellipse cx={30} cy={12} rx={3.5} ry={4} fill={RED} stroke={BLACK} strokeWidth={0.5} />
          </g>

          {/* Legs */}
          <path
            d="M-6 14 L-14 28 L-12 34 L-4 22 Z"
            fill={BLUE}
            stroke={DARK_BLUE}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
          <path d="M-12 30 L-16 36 L-10 36 Z" fill={RED} stroke={BLACK} strokeWidth={0.5} />
          <path
            d="M6 14 L14 28 L12 34 L4 22 Z"
            fill={BLUE}
            stroke={DARK_BLUE}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
          <path d="M12 30 L16 36 L10 36 Z" fill={RED} stroke={BLACK} strokeWidth={0.5} />

          {/* Torso */}
          <path
            d="M-11 2 L-13 16 L-6 18 L0 16 L6 18 L13 16 L11 2 Z"
            fill={BLUE}
            stroke={DARK_BLUE}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
          <path
            d="M-9 0 Q0 -6 9 0 L8 14 Q0 18 -8 14 Z"
            fill={RED}
            stroke={BLACK}
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
          <path
            d="M0 -4 L0 12 M-6 2 Q0 -2 6 2 M-7 8 Q0 4 7 8"
            stroke={BLACK}
            strokeWidth={0.45}
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />

          {/* Chest spider emblem */}
          <g transform="translate(0, 5) scale(0.55)" fill={BLACK}>
            <ellipse cx={0} cy={0} rx={5} ry={6} />
            <ellipse cx={0} cy={-5} rx={3} ry={3.5} />
            {[-1, 1].flatMap((side) =>
              [0, 1, 2, 3].map((leg) => (
                <path
                  key={`${side}-${leg}`}
                  d={`M${side * 3},${leg < 2 ? -2 : 2} Q${side * 14},${leg * 4 - 4} ${side * 10},${leg * 5}`}
                  stroke={BLACK}
                  strokeWidth={1.8}
                  fill="none"
                  strokeLinecap="round"
                />
              ))
            )}
          </g>

          {/* Neck connector */}
          <rect x={-3.5} y={-8} width={7} height={5} rx={1.5} fill={RED} />

          {/* Head — leans toward the cursor */}
          <g
            style={{
              transform: `rotate(${headTilt}deg)`,
              transformBox: "fill-box",
              transformOrigin: "50% 95%",
              transition: eyeTransition,
            }}
          >
            <path
              d="M-10 -10 Q0 -20 10 -10 Q12 -4 10 0 Q0 4 -10 0 Q-12 -4 -10 -10 Z"
              fill={RED}
              stroke={BLACK}
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
            <path
              d="M0 -16 L0 -2 M-7 -12 Q0 -16 7 -12 M-8 -6 Q0 -10 8 -6"
              stroke={BLACK}
              strokeWidth={0.4}
              strokeLinecap="round"
              fill="none"
              opacity={0.65}
            />

            {/* Eyes — track the cursor and blink */}
            <g
              style={{
                transform: `translate(${eyeShiftX}px, ${eyeShiftY}px) scaleY(${blink ? 0.12 : 1})`,
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: blink ? "transform 80ms ease-in" : eyeTransition,
              }}
            >
              <path
                d="M-7 -8 Q-3 -12 0 -9 Q-1 -5 -6 -4 Z"
                fill={WHITE}
                stroke={BLACK}
                strokeWidth={0.7}
                strokeLinejoin="round"
                filter={eyeGlow}
                className="transition-[filter] duration-300"
              />
              <path
                d="M7 -8 Q3 -12 0 -9 Q1 -5 6 -4 Z"
                fill={WHITE}
                stroke={BLACK}
                strokeWidth={0.7}
                strokeLinejoin="round"
                filter={eyeGlow}
                className="transition-[filter] duration-300"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  )
}
