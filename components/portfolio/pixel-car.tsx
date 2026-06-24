"use client"

import { useEffect, useRef } from "react"
import type { DriveState } from "@/lib/rc-car"

// A top-down pixel-art RC car driving on a scrolling road, rendered on a
// low-res <canvas> that's upscaled with nearest-neighbour for crisp pixels.
// Everything reacts to the live DriveState: the road scrolls with throttle,
// the car slides + tilts when steering, boost adds flames / speed-lines /
// screen-shake, and exhaust puffs trail behind.

const W = 160 // logical canvas width  (portrait 2:3)
const H = 240 // logical canvas height

const COLORS = {
  road: "#101018",
  roadEdge: "#1b1b26",
  lane: "#2f8fd0",
  dash: "#3a3a4a",
  body: "#18A0FB",
  bodyDark: "#0e6fb0",
  cabin: "#bfe6ff",
  stripe: "#eaf6ff",
  wheel: "#15151b",
  tread: "#3a3a46",
  head: "#fff3c0",
  tail: "#ff5a5a",
  reverse: "#f4f7ff",
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function PixelCar({ state }: { state: DriveState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The animation loop reads the latest drive state through this ref so it
  // never has to restart when the state changes.
  const stateRef = useRef<DriveState>(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return
    // Bind to a non-null const so the nested draw closures keep the narrowed type.
    const ctx = ctx2d

    // Mutable scene state, persisted across frames.
    let raf = 0
    let last = 0
    let scroll = 0 // road scroll offset
    let carX = W / 2 // eased car x
    let angle = 0 // eased steer tilt (radians)
    let wheelPhase = 0 // wheel-spin animation phase
    let rngSeed = 1 // deterministic-ish jitter without Math.random reliance
    const particles: Particle[] = []

    const rand = () => {
      // small xorshift so flames/dust flicker without leaning on Math.random
      rngSeed ^= rngSeed << 13
      rngSeed ^= rngSeed >> 17
      rngSeed ^= rngSeed << 5
      return ((rngSeed >>> 0) % 1000) / 1000
    }

    const px = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
    }

    function drawCar(cx: number, cy: number, a: number, s: DriveState) {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(a)

      const moving = s.throttle !== "idle"
      // Wheels (4 corners). Tread flickers to fake rotation while moving.
      const wheelY = [-13, 11]
      const wheelX = [-12, 7]
      for (const wy of wheelY) {
        for (const wx of wheelX) {
          px(wx, wy, 6, 9, COLORS.wheel)
          const tread = moving ? (Math.floor(wheelPhase) % 2 === 0 ? 1 : 4) : 3
          px(wx + 1, wy + tread, 4, 2, COLORS.tread)
        }
      }

      // Front wheels steer with the input.
      if (s.steer !== "center") {
        const dir = s.steer === "left" ? -1 : 1
        for (const wx of wheelX) px(wx + dir, -13, 6, 9, COLORS.wheel)
      }

      // Body + dark outline.
      px(-11, -15, 22, 30, COLORS.bodyDark)
      px(-10, -14, 20, 28, COLORS.body)
      // Centre racing stripe.
      px(-2, -14, 4, 28, COLORS.stripe)
      // Windshield / cabin near the front.
      px(-7, -9, 14, 8, COLORS.cabin)
      // Headlights (front = up).
      px(-9, -15, 3, 2, COLORS.head)
      px(6, -15, 3, 2, COLORS.head)
      // Tail / reverse lights at the back.
      const rear = s.throttle === "rev" ? COLORS.reverse : COLORS.tail
      px(-9, 13, 3, 2, rear)
      px(6, 13, 3, 2, rear)

      // Antenna with a tiny fluttering flag.
      const flag = Math.sin(wheelPhase * 0.8) * 1.5
      px(8, -22, 1, 8, "#8aa0b8")
      px(9, -22 + flag, 4, 3, COLORS.body)

      ctx.restore()
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      const dt = last ? Math.min((t - last) / 16.67, 2.5) : 1
      last = t
      const s = stateRef.current

      // Target speed from throttle (px/frame), positive scrolls road downward.
      const base = s.throttle === "fwd" ? (s.boost ? 9 : 5) : s.throttle === "rev" ? -3 : 0
      scroll += base * dt
      wheelPhase += Math.abs(base) * 0.25 * dt + (s.throttle !== "idle" ? 0.2 : 0)

      // Ease car x + tilt toward the steer target.
      const targetX = W / 2 + (s.steer === "left" ? -34 : s.steer === "right" ? 34 : 0)
      const targetA = s.steer === "left" ? -0.16 : s.steer === "right" ? 0.16 : 0
      carX = lerp(carX, targetX, 0.12 * dt)
      angle = lerp(angle, targetA, 0.15 * dt)
      const carY = H * 0.62

      // Screen shake while boosting.
      const shake = s.boost && s.throttle === "fwd" ? 1.6 : 0
      const ox = shake ? (rand() - 0.5) * shake * 2 : 0
      const oy = shake ? (rand() - 0.5) * shake * 2 : 0

      // ── draw ────────────────────────────────────────────────────────
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.imageSmoothingEnabled = false
      px(0, 0, W, H, COLORS.road)
      ctx.translate(ox, oy)

      // Road edges.
      px(8, 0, 4, H, COLORS.roadEdge)
      px(W - 12, 0, 4, H, COLORS.roadEdge)

      // Scrolling centre dashes.
      const gap = 34
      const off = ((scroll % gap) + gap) % gap
      for (let y = -gap; y < H + gap; y += gap) {
        px(W / 2 - 2, y + off, 4, 16, COLORS.dash)
      }
      // Side lane ticks for extra speed sense.
      for (let y = -20; y < H + 20; y += 20) {
        const yo = ((y + scroll * 1.4) % (H + 40) + (H + 40)) % (H + 40) - 20
        px(20, yo, 3, 6, COLORS.roadEdge)
        px(W - 23, yo, 3, 6, COLORS.roadEdge)
      }

      // Speed lines on boost.
      if (s.boost && s.throttle === "fwd") {
        for (let i = 0; i < 6; i++) {
          const lx = 16 + rand() * (W - 32)
          const ly = (rand() * H + scroll * 4) % H
          ctx.fillStyle = "rgba(24,160,251,0.5)"
          ctx.fillRect(Math.round(lx), Math.round(ly), 1, 14)
        }
      }

      // Spawn exhaust / flame particles behind the car while moving.
      if (s.throttle !== "idle" && particles.length < 70) {
        const boosting = s.boost && s.throttle === "fwd"
        const count = boosting ? 3 : 1
        for (let i = 0; i < count; i++) {
          const flame = boosting && rand() > 0.25
          particles.push({
            x: carX + (rand() - 0.5) * 10,
            y: carY + 16,
            vx: (rand() - 0.5) * 0.6,
            vy: (boosting ? 2.5 : 1.2) + rand(),
            life: 0,
            max: boosting ? 14 : 22,
            size: flame ? 3 : 2,
            color: flame
              ? rand() > 0.5
                ? "#ffd23f"
                : "#ff7a18"
              : "rgba(150,160,180,0.5)",
          })
        }
      }

      // Update + draw particles.
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life += dt
        if (p.life >= p.max) {
          particles.splice(i, 1)
          continue
        }
        px(p.x, p.y, p.size, p.size, p.color)
      }

      drawCar(carX, carY, angle, s)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      className="h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  )
}
