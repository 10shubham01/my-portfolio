"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { EMAIL } from "@/lib/canvas-data"

export function SayHiButton() {
  const [copied, setCopied] = useState(false)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  async function copyEmail(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault()

    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      posthog.capture("contact_email_copied", { method: "clipboard" })
    } catch {
      const input = document.createElement("input")
      input.value = EMAIL
      document.body.appendChild(input)
      input.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        posthog.capture("contact_email_copied", { method: "execCommand" })
      } catch {
        window.alert(`Email: ${EMAIL}`)
      }
      document.body.removeChild(input)
    }
  }

  return (
    <span className="group relative inline-block">
      <button
        onPointerDown={copyEmail}
        className="cursor-pointer text-blue-500 hover:underline"
      >
        Get in touch
      </button>
      <span
        className={`pointer-events-none absolute -top-8 left-1/2 flex -translate-x-1/2 items-center overflow-hidden rounded-md bg-gray-700 whitespace-nowrap transition-all duration-200 ${
          copied
            ? "translate-y-0 opacity-100"
            : "translate-y-0.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        }`}
        style={{ height: 24, paddingLeft: 8, paddingRight: 8 }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: 11,
            color: "#ffffff",
            letterSpacing: 0,
          }}
        >
          {copied ? (isMobile ? "Email copied!" : "Looking forward :)") : "Copy Email"}
        </span>
      </span>
    </span>
  )
}
