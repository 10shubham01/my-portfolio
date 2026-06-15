"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { hexToHsl, hslToHex } from "@/lib/color-utils"

export function ColorPicker({
  value,
  defaultValue,
  onChange,
  open,
  onOpenChange,
  onReset,
}: {
  value: string
  defaultValue: string
  onChange: (color: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  onReset: () => void
}) {
  const [[hue, saturation, lightness], setHsl] = useState(() => hexToHsl(value))
  const [hexInput, setHexInput] = useState(value.toUpperCase())
  const saturationRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const draggingSaturation = useRef(false)
  const draggingHue = useRef(false)
  const hueRefValue = useRef(hue)
  const satRefValue = useRef(saturation)
  const lightRefValue = useRef(lightness)

  hueRefValue.current = hue
  satRefValue.current = saturation
  lightRefValue.current = lightness

  useEffect(() => {
    setHsl(hexToHsl(value))
    setHexInput(value.toUpperCase())
  }, [value])

  const updateFromSaturation = useCallback(
    (clientX: number, clientY: number) => {
      const rect = saturationRef.current?.getBoundingClientRect()
      if (!rect) return

      const sat = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const light = Math.max(0, Math.min(100, (1 - (clientY - rect.top) / rect.height) * 100))
      const next = hslToHex(hueRefValue.current, sat, light)
      setHsl([hueRefValue.current, sat, light])
      setHexInput(next.toUpperCase())
      onChange(next)
    },
    [onChange]
  )

  const updateFromHue = useCallback(
    (clientX: number) => {
      const rect = hueRef.current?.getBoundingClientRect()
      if (!rect) return

      const nextHue = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360))
      const next = hslToHex(nextHue, satRefValue.current, lightRefValue.current)
      setHsl([nextHue, satRefValue.current, lightRefValue.current])
      setHexInput(next.toUpperCase())
      onChange(next)
    },
    [onChange]
  )

  const showReset = !open && value.toLowerCase() !== defaultValue.toLowerCase()
  const hueColor = `hsl(${hue}, 100%, 50%)`

  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        onClick={open ? undefined : () => onOpenChange(true)}
        style={{
          width: open ? 156 : 96,
          height: open ? 170 : 26,
          borderRadius: open ? 12 : 6,
          background: "#404040",
          border: "1px solid #525252",
          overflow: "hidden",
          cursor: open ? "default" : "pointer",
          transition:
            "width 0.25s cubic-bezier(0.4,0,0.2,1), height 0.25s cubic-bezier(0.4,0,0.2,1), border-radius 0.25s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 6,
            paddingRight: 10,
            opacity: open ? 0 : 1,
            transition: "opacity 0.15s ease",
            pointerEvents: open ? "none" : "auto",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 2,
              flexShrink: 0,
              background: value,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "#fafafa",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {value.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 10,
            opacity: open ? 1 : 0,
            transition: open ? "opacity 0.2s ease 0.15s" : "opacity 0.1s ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div
            ref={saturationRef}
            style={{
              position: "relative",
              width: 136,
              height: 96,
              borderRadius: 6,
              background: hueColor,
              cursor: "crosshair",
              overflow: "hidden",
              flexShrink: 0,
            }}
            onPointerDown={(event) => {
              draggingSaturation.current = true
              saturationRef.current?.setPointerCapture(event.pointerId)
              updateFromSaturation(event.clientX, event.clientY)
            }}
            onPointerMove={(event) => {
              if (draggingSaturation.current) {
                updateFromSaturation(event.clientX, event.clientY)
              }
            }}
            onPointerUp={() => {
              draggingSaturation.current = false
            }}
            onPointerCancel={() => {
              draggingSaturation.current = false
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #fff, transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, #000, transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            ref={hueRef}
            style={{
              position: "relative",
              height: 12,
              borderRadius: 8,
              cursor: "pointer",
              flexShrink: 0,
              width: 136,
              background:
                "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
            }}
            onPointerDown={(event) => {
              draggingHue.current = true
              hueRef.current?.setPointerCapture(event.pointerId)
              updateFromHue(event.clientX)
            }}
            onPointerMove={(event) => {
              if (draggingHue.current) updateFromHue(event.clientX)
            }}
            onPointerUp={() => {
              draggingHue.current = false
            }}
            onPointerCancel={() => {
              draggingHue.current = false
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `clamp(6px, ${(hue / 360) * 100}%, calc(100% - 6px))`,
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: hueColor,
                border: "2px solid white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: 136,
              height: 24,
              paddingLeft: 6,
              paddingRight: 10,
              background: "linear-gradient(180deg, #262626 -27.12%, #404040 100%)",
              border: "1px solid #525252",
              borderRadius: 6,
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                flexShrink: 0,
                background: value,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={(event) => {
                const next = event.target.value.startsWith("#")
                  ? event.target.value
                  : `#${event.target.value}`
                setHexInput(next.toUpperCase())
                if (/^#[0-9a-fA-F]{6}$/.test(next)) {
                  setHsl(hexToHsl(next))
                  onChange(next.toLowerCase())
                }
              }}
              spellCheck={false}
              style={{
                flex: 1,
                height: 24,
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#fafafa",
                background: "transparent",
                border: "none",
                outline: "none",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                padding: 0,
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        title="Reset to default"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          marginTop: 5,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "#a3a3a3",
          flexShrink: 0,
          opacity: showReset ? 1 : 0,
          pointerEvents: showReset ? "auto" : "none",
          transition: showReset
            ? "opacity 0.3s cubic-bezier(0,0,0.2,1) 0.05s"
            : "opacity 0.15s cubic-bezier(0.4,0,1,1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 5.5C4.2 3.4 6.4 2 9 2C12.3 2 15 4.7 15 8C15 11.3 12.3 14 9 14C6.1 14 3.6 12.1 2.8 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 3L3 5.5L5.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
