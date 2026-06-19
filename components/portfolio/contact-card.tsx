"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"

// Google Form submission. The form has two fields; their entry ids were read
// from the live form's FB_PUBLIC_LOAD_DATA_ payload.
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSe7weRqDB00r076Yz4dLNBQqRgO695BzVObdH4T8jSiCWWGcQ/formResponse"
const NAME_FIELD = "entry.182498559"
const MESSAGE_FIELD = "entry.134234257"

// Hard cap on the message body, surfaced as a live counter on the slip.
const MESSAGE_MAX = 800

// Figma's measurement blue — the same accent the ruler and selection
// corner-frames use, so the title block reads as part of the same technical
// drawing language.
const BLUE = "#18A0FB"

type Status = "idle" | "sending" | "sent" | "error"

const microLabel =
  "font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-foreground/40 dark:text-foreground/35 select-none"

// One cell of the title-block grid: a tiny stencilled caption sat above a value.
function StampCell({
  caption,
  value,
  className,
}: {
  caption: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col justify-center px-2.5 py-1.5", className)}>
      <span className={microLabel}>{caption}</span>
      <span className="font-mono text-[11px] tracking-wide text-foreground/70 dark:text-foreground/60">
        {value}
      </span>
    </div>
  )
}

export function ContactCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const canSend =
    name.trim().length > 0 && message.trim().length > 0 && status !== "sending"

  // The typed name, inked onto the "Signed" line in a cursive hand. Long names
  // shrink toward a legible floor so the signature never spills out of the cell.
  // The line below sits in a fixed-height row, so changing the size as the user
  // types never reflows the slip.
  const signature = name.trim()
  const signatureSize = `${Math.max(14, 24 - Math.max(0, signature.length - 8) * 0.6).toFixed(1)}px`

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSend) return

    setStatus("sending")
    posthog.capture("contact_submitted", {
      name_length: name.length,
      message_length: message.length,
    })

    const body = new URLSearchParams()
    body.append(NAME_FIELD, name)
    body.append(MESSAGE_FIELD, message)

    try {
      // Google Forms sends no CORS headers, so the response is opaque — a
      // resolved fetch is our success signal.
      await fetch(FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
      setStatus("sent")
      setName("")
      setMessage("")
    } catch {
      setStatus("error")
      posthog.capture("contact_error")
    }
  }

  // Stop pointer-down from bubbling to CanvasFrame, which would start a drag
  // and steal focus from the field instead of letting the user type.
  const stopDrag = (event: React.PointerEvent) => event.stopPropagation()

  // Hairline rule shared by every divider in the block.
  const rule = "border-foreground/15 dark:border-foreground/15"
  const graphPaper = {
    backgroundImage: `linear-gradient(${BLUE}14 1px, transparent 1px), linear-gradient(90deg, ${BLUE}14 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
  } as const

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-full w-full flex-col bg-background/80 backdrop-blur-[1px]",
        // Double-ruled frame: outer hairline + inset ring, the way a real
        // drawing border is drawn.
        "border",
        rule
      )}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      {/* inset border line — the inner rule of the drawing frame */}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-[5px] border", rule)}
      />
      {/* brand-blue crop ticks just outside each corner */}
      {[
        "-top-[3px] -left-[3px] border-t border-l",
        "-top-[3px] -right-[3px] border-t border-r",
        "-bottom-[3px] -left-[3px] border-b border-l",
        "-right-[3px] -bottom-[3px] border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={cn("pointer-events-none absolute h-2.5 w-2.5", pos)}
          style={{ borderColor: BLUE }}
        />
      ))}

      <form onSubmit={handleSubmit} className="relative flex h-full flex-col p-[5px]">
        {/* ── Title strip ─────────────────────────────────────────────── */}
        <div className={cn("flex items-stretch border-b", rule)}>
          <div className="flex flex-1 items-center gap-2 px-3 py-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rotate-45"
              style={{ backgroundColor: BLUE }}
            />
            <span className="font-mono text-[12px] font-semibold tracking-[0.2em] text-foreground/80 uppercase dark:text-foreground/70">
              Transmission
            </span>
          </div>
          <StampCell caption="No." value="001" className={cn("border-l", rule)} />
          <StampCell caption="Rev" value="A" className={cn("border-l", rule)} />
          <StampCell
            caption="Scale"
            value="1:1"
            className={cn("border-l", rule)}
          />
        </div>

        {/* ── FROM field ──────────────────────────────────────────────── */}
        <div className={cn("flex items-stretch border-b", rule)}>
          <div
            className={cn(
              "flex w-[78px] shrink-0 items-center border-r px-3",
              rule
            )}
          >
            <span className={microLabel}>From</span>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPointerDown={stopDrag}
            placeholder="your name"
            maxLength={120}
            disabled={status === "sent"}
            className="w-full bg-transparent px-3 py-2.5 font-mono text-[13px] tracking-wide text-foreground/85 placeholder:text-foreground/25 focus:outline-none dark:text-foreground/80"
          />
        </div>

        {/* ── MESSAGE field (graph paper) ─────────────────────────────── */}
        <div className="relative flex flex-1 flex-col">
          <span className={cn("absolute top-2 left-3 z-10", microLabel)}>
            Message
          </span>
          {/* Live character counter — ticks toward the cap and warms to amber
              as the sender approaches the limit. */}
          <span
            className={cn(
              "absolute top-2 right-3 z-10 tabular-nums",
              microLabel,
              message.length >= MESSAGE_MAX * 0.9 &&
                "text-amber-500/80 dark:text-amber-400/80"
            )}
          >
            {message.length}/{MESSAGE_MAX}
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
            onPointerDown={stopDrag}
            placeholder="with great software comes great responsibility…"
            maxLength={MESSAGE_MAX}
            disabled={status === "sent"}
            className="h-full w-full resize-none bg-transparent px-3 pt-7 pb-3 font-mono text-[13px] leading-[16px] tracking-wide text-foreground/85 placeholder:text-foreground/25 focus:outline-none dark:text-foreground/80"
            style={graphPaper}
          />
        </div>

        {/* ── Footer: signature line + SEND stamp ─────────────────────── */}
        <div className={cn("flex items-stretch border-t", rule)}>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
            <span className={microLabel}>Signed</span>
            {/* Fixed-height value row: its height never changes, so scaling the
                signature as the user types can't reflow the slip. */}
            <div className="mt-1 flex h-[30px] items-center overflow-hidden">
              {status === "error" ? (
                <span className="font-mono text-[11px] tracking-wide text-red-400">
                  — transmission failed, retry
                </span>
              ) : status === "sending" ? (
                <span className="font-mono text-[11px] tracking-wide text-foreground/55 dark:text-foreground/45">
                  — transmitting…
                </span>
              ) : signature ? (
                // Inked signature of whatever the sender typed. The font size
                // eases down as the name grows so even long names stay on one
                // line inside the title-block cell.
                <span
                  className="block w-full overflow-hidden font-signature font-thin leading-none whitespace-nowrap text-foreground/80 dark:text-foreground/75"
                  style={{ fontSize: signatureSize }}
                  title={signature}
                >
                  {signature}
                </span>
              ) : (
                <span className="font-mono text-[11px] tracking-wide text-foreground/55 dark:text-foreground/45">
                  —————————————
                </span>
              )}
            </div>
          </div>

          {/* Rubber-stamp SEND button. Sits at a jaunty angle until hovered,
              then squares up — like lining a stamp up with the page. */}
          <button
            type="submit"
            disabled={!canSend}
            onPointerDown={stopDrag}
            className={cn(
              "group relative m-2 flex items-center gap-2 px-4 font-mono text-[12px] font-bold tracking-[0.22em] uppercase transition-all duration-200",
              "border-2 -rotate-[7deg] hover:rotate-0",
              canSend
                ? "cursor-pointer text-[#18A0FB] active:scale-95"
                : "cursor-not-allowed border-foreground/15 text-foreground/25"
            )}
            style={canSend ? { borderColor: BLUE } : undefined}
          >
            {status === "sending" ? "···" : "Send"}
            <span aria-hidden className="text-[14px] leading-none">
              →
            </span>
          </button>
        </div>
      </form>

      {/* RECEIVED stamp — slams over the slip once the message lands. */}
      {status === "sent" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="received-stamp flex flex-col items-center gap-1 border-[3px] px-6 py-3 -rotate-[14deg]"
            style={{ borderColor: BLUE, color: BLUE }}
          >
            <span className="font-mono text-[22px] font-extrabold tracking-[0.18em] uppercase">
              Received
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">
              thanks — talk soon
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
