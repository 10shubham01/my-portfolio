"use client"

import { useEffect, useState } from "react"
import { DEFAULT_BG } from "@/lib/canvas-data"
import { ColorPicker } from "@/components/portfolio/color-picker"

export function InfoPanel({
  isOpen,
  bgColor,
  onBgColorChange,
  onResetCanvas,
}: {
  isOpen: boolean
  bgColor: string
  onBgColorChange: (color: string) => void
  onResetCanvas?: () => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [rPressed, setRPressed] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    if (!isOpen) setPickerOpen(false)
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return
      if (
        event.key.toLowerCase() === "r" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        setRPressed(true)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") setRPressed(false)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  const rows = [
    ["Fonts", "Helvetica Neue, Basteleur, Geist Mono"],
    ["Tech Stack", "Next.js, React, Vue, TypeScript, AWS"],
    ["Location", "Mumbai, India"],
  ] as const

  const footerRows = [
    ["Deployed on", "Vercel"],
    ["Version", "2026"],
  ] as const

  return (
    <div
      onPointerDown={(event) => {
        event.stopPropagation()
        setPickerOpen(false)
      }}
      style={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "16px 0",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          padding: "0 16px",
        }}
      >
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}
          >
            <span
              style={{
                width: 80,
                flexShrink: 0,
                textAlign: "right",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#a3a3a3",
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#e5e5e5",
                whiteSpace: "nowrap",
                lineHeight: "normal",
                flex: "1 0 0",
                minWidth: 1,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          width: "100%",
          padding: "0 16px",
        }}
      >
        <span
          style={{
            width: 80,
            flexShrink: 0,
            textAlign: "right",
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            color: "#a3a3a3",
            whiteSpace: "nowrap",
            lineHeight: "normal",
            paddingTop: pickerOpen ? 6 : 5.75,
            alignSelf: "flex-start",
            transition: "padding-top 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          Background
        </span>
        <div style={{ flex: "1 0 0", minWidth: 1 }}>
          <ColorPicker
            value={bgColor}
            defaultValue={DEFAULT_BG}
            onChange={onBgColorChange}
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onReset={() => onBgColorChange(DEFAULT_BG)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          padding: "0 16px",
        }}
      >
        {footerRows.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                width: 80,
                flexShrink: 0,
                textAlign: "right",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#a3a3a3",
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#e5e5e5",
                whiteSpace: "nowrap",
                lineHeight: "normal",
                flex: "1 0 0",
                minWidth: 1,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: 1, background: "#404040", flexShrink: 0 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          padding: "0 16px",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: "#737373",
          lineHeight: 1.6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#a3a3a3" }}>Press</span>
          <button
            onClick={(event) => {
              event.stopPropagation()
              onResetCanvas?.()
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
              setRPressed(true)
            }}
            onPointerUp={() => setRPressed(false)}
            onPointerLeave={() => setRPressed(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
              height: 20,
              background: "linear-gradient(180deg, #404040 0%, #262626 100%)",
              border: "1px solid #525252",
              borderBottom: rPressed ? "1px solid #525252" : "2px solid #171717",
              borderRadius: 4,
              color: "#e5e5e5",
              fontSize: 12,
              fontWeight: 400,
              cursor: "pointer",
              transform: rPressed ? "translateY(1px)" : "none",
              transition: "transform 0.05s ease, border-bottom 0.05s ease",
              outline: "none",
            }}
          >
            R
          </button>
          <span style={{ color: "#a3a3a3" }}>to reset the canvas</span>
        </div>
      </div>

      <div style={{ width: "100%", height: 1, background: "#404040", flexShrink: 0 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: "#737373",
          lineHeight: 1.6,
          width: "100%",
          padding: "0 16px",
        }}
      >
        <p style={{ margin: 0 }}>Built with craft.</p>
        <p style={{ margin: 0 }}>shubhamgupta.dev</p>
      </div>

      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 4,
            width: "100%",
          }}
        >
          <button
            onClick={(event) => {
              event.stopPropagation()
              onResetCanvas?.()
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
              setRPressed(true)
            }}
            onPointerUp={() => setRPressed(false)}
            onPointerLeave={() => setRPressed(false)}
            style={{
              width: "100%",
              margin: "0 16px",
              height: 36,
              background: "linear-gradient(180deg, #404040 0%, #262626 100%)",
              border: "1px solid #525252",
              borderRadius: 8,
              color: "#e5e5e5",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              cursor: "pointer",
              transform: rPressed ? "translateY(1px)" : "none",
            }}
          >
            Reset canvas
          </button>
        </div>
      )}

      <div style={{ width: "100%", height: 1, background: "#404040", flexShrink: 0 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: "#737373",
          lineHeight: 1.6,
          width: "100%",
          padding: "0 16px",
        }}
      >
        <span>©2026</span>
        <span>Shubham Gupta</span>
      </div>
    </div>
  )
}
