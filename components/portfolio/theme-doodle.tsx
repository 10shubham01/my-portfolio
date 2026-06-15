"use client"

import { useTheme } from "@/components/portfolio/theme-provider"

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315] as const

function SunDoodle() {
  return (
    <>
      {RAYS.map((angle) => (
        <ellipse
          key={angle}
          cx="32"
          cy="32"
          rx="3.2"
          ry="7.5"
          fill="#F59E0B"
          transform={`rotate(${angle} 32 32) translate(0 -21)`}
        />
      ))}

      <path
        fill="#FBBF24"
        d="M32 21.5c7.8-.8 14.8 4.2 16.2 11.8 1.4 7.6-3.4 15-10.8 17.2-7.4 2.2-15.4-1.4-18.4-8.6-3-7.2.2-15.4 7.2-19.1 1.6-.9 3.5-1.4 5.8-1.3Z"
      />

      <path
        fill="#FDE68A"
        d="M28.5 27.5c2.8-1.2 6.2-.4 8 1.8 1.8 2.2 1.2 5.6-1.2 7.2-2.4 1.6-5.8 1-7.4-1.4-1.6-2.4-.8-5.8 1.6-7.2 0-.2-.5-.3-1-0.4Z"
        opacity="0.85"
      />
    </>
  )
}

function MoonDoodle() {
  return (
    <>
      <path
        fill="#94A3B8"
        d="M32 15.5c9.1 0 16.5 7.4 16.5 16.5S41.1 48.5 32 48.5 15.5 41.1 15.5 32 22.9 15.5 32 15.5Z"
      />

      <ellipse cx="27" cy="27" rx="3.2" ry="2.6" fill="#64748B" opacity="0.55" />
      <ellipse cx="36" cy="31" rx="2.2" ry="1.9" fill="#64748B" opacity="0.45" />
      <ellipse cx="30" cy="38" rx="1.6" ry="1.4" fill="#64748B" opacity="0.4" />
      <ellipse cx="38" cy="37" rx="1.1" ry="1" fill="#64748B" opacity="0.35" />
      <ellipse cx="25" cy="35" rx="1.4" ry="0.9" fill="#64748B" opacity="0.3" transform="rotate(-20 25 35)" />
    </>
  )
}

export function ThemeDoodle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="relative h-full w-full" style={{ pointerEvents: "none" }}>
      <button
        type="button"
        onClick={toggleTheme}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="absolute top-1/2 left-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 transition-transform hover:scale-105 active:scale-95"
        style={{ pointerEvents: "auto" }}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
          {isDark ? <SunDoodle /> : <MoonDoodle />}
        </svg>
      </button>
    </div>
  )
}
