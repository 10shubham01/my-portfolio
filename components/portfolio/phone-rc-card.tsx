"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { DataConnection, Peer as PeerInstance } from "peerjs"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import {
  CardChip,
  CardSectionTitle,
  CardSurface,
  CornerFrame,
  cardBodyClass,
  cardMetaClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"
import { setRcCapturing } from "@/lib/rc-input"
import {
  DRIVE_KEYS,
  IDLE_STATE,
  controlForKey,
  createPeerId,
  driveUrl,
  shortCode,
  stateFromKeys,
  vibrationFor,
  type DriveState,
} from "@/lib/rc-car"

const BLUE = "#18A0FB"

type LinkStatus = "off" | "connecting" | "waiting" | "linked" | "error"

export function PhoneRcCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const ref = useFrameResize(onResize)

  const peerRef = useRef<PeerInstance | null>(null)
  const connRef = useRef<DataConnection | null>(null)
  const pressedRef = useRef<Set<string>>(new Set())
  const seqRef = useRef(0)
  const lastSentRef = useRef<DriveState>(IDLE_STATE)

  const [status, setStatus] = useState<LinkStatus>("off")
  const [link, setLink] = useState<{
    url: string
    code: string
    qr: string
    insecure: boolean
  } | null>(null)
  const [engaged, setEngaged] = useState(false)
  const [drive, setDrive] = useState<DriveState>(IDLE_STATE)
  const [copied, setCopied] = useState(false)

  // Tear everything down — used on unmount and on "disconnect".
  const teardown = useCallback(() => {
    connRef.current?.close()
    peerRef.current?.destroy()
    connRef.current = null
    peerRef.current = null
    pressedRef.current.clear()
    lastSentRef.current = IDLE_STATE
    setDrive(IDLE_STATE)
    setEngaged(false)
  }, [])

  useEffect(() => () => teardown(), [teardown])

  // While this card is the active card, it owns the keyboard — tell the canvas
  // to stand down its own shortcuts (theme toggle, arrow-key cycling, konami)
  // so they don't fight the driving keys.
  useEffect(() => {
    setRcCapturing(interactive)
    return () => setRcCapturing(false)
  }, [interactive])

  // Open a host peer and wait for a phone to join. PeerJS touches the DOM/RTC
  // stack, so it's imported lazily and only in the browser.
  const openLink = useCallback(async () => {
    if (status !== "off" && status !== "error") return
    setStatus("connecting")
    posthog.capture("rc_link_opened")

    try {
      const { default: Peer } = await import("peerjs")
      const id = createPeerId()
      const peer = new Peer(id)
      peerRef.current = peer

      peer.on("open", async () => {
        const origin = window.location.origin
        const url = driveUrl(origin, id)
        const { default: QRCode } = await import("qrcode")
        const qr = await QRCode.toDataURL(url, {
          margin: 1,
          width: 320,
          color: { dark: "#0a0a0a", light: "#ffffff" },
        })
        // A QR pointing at http (or localhost) is a dead end for a real phone:
        // iOS blocks WebRTC on insecure origins, and localhost isn't reachable.
        const insecure = !window.isSecureContext
        setLink({ url, code: shortCode(id), qr, insecure })
        setStatus("waiting")
      })

      peer.on("connection", (conn) => {
        connRef.current = conn
        conn.on("open", () => {
          conn.send({ t: "hello", role: "remote" })
          setStatus("linked")
          setEngaged(true)
          posthog.capture("rc_car_connected")
        })
        conn.on("close", () => {
          connRef.current = null
          setEngaged(false)
          setDrive(IDLE_STATE)
          setStatus("waiting")
        })
      })

      peer.on("error", () => setStatus("error"))
    } catch {
      setStatus("error")
    }
  }, [status])

  // Push the current DriveState to the car, but only when it actually changes.
  const sendState = useCallback((next: DriveState) => {
    const prev = lastSentRef.current
    if (
      prev.throttle === next.throttle &&
      prev.steer === next.steer &&
      prev.boost === next.boost
    ) {
      return
    }
    lastSentRef.current = next
    setDrive(next)
    connRef.current?.send({ t: "drive", seq: seqRef.current++, ...next })
  }, [])

  // Keyboard remote. Only attached while linked + engaged so it never steals
  // arrow keys from the rest of the canvas.
  useEffect(() => {
    if (!engaged || status !== "linked") return

    const sync = () => sendState(stateFromKeys(pressedRef.current))

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!controlForKey(key)) return
      if (DRIVE_KEYS.has(key)) e.preventDefault()
      if (e.repeat) return
      pressedRef.current.add(key)
      sync()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!controlForKey(key)) return
      pressedRef.current.delete(key)
      sync()
    }
    // Releasing focus shouldn't leave the car flooring it.
    const onBlur = () => {
      pressedRef.current.clear()
      sync()
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [engaged, status, sendState])

  const stopDrag = (e: React.PointerEvent) => e.stopPropagation()

  const copyLink = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — the QR and code still work */
    }
  }

  const note = vibrationFor(drive).note

  return (
    <CardSurface ref={ref} interactive={interactive}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <CardSectionTitle>Phone RC</CardSectionTitle>
        <span className={cardMetaClass}>WebRTC · no app</span>
      </div>

      <p className={cn("mt-4 text-[13px]", cardBodyClass)}>
        Pair your phone and it becomes the car — you&apos;ll hear it rev (and
        feel it, on Android). Drive it from here with the keyboard.
      </p>

      {/* ── OFF: call to action ─────────────────────────────────────────── */}
      {(status === "off" || status === "error") && (
        <button
          type="button"
          onPointerDown={stopDrag}
          onClick={openLink}
          className="group mt-5 inline-flex items-center gap-2 self-start border-2 px-4 py-2 font-mono text-[12px] font-bold tracking-[0.18em] uppercase transition-all hover:scale-[1.02] active:scale-95"
          style={{ borderColor: BLUE, color: BLUE }}
        >
          {status === "error" ? "Retry link" : "Open link"}
          <span aria-hidden>→</span>
        </button>
      )}
      {status === "error" && (
        <p className="mt-2 font-mono text-[11px] text-red-400">
          couldn&apos;t reach the relay — check the network and retry
        </p>
      )}

      {/* ── CONNECTING ──────────────────────────────────────────────────── */}
      {status === "connecting" && (
        <p className={cn("mt-5 font-mono text-[12px]", cardMetaClass)}>
          opening secure channel…
        </p>
      )}

      {/* ── WAITING: pairing panel ──────────────────────────────────────── */}
      {status === "waiting" && link && (
        <div className="mt-5 flex flex-col gap-3">
          <span className={cardMetaClass}>Scan to pair · waiting for car</span>
          <div className="flex items-center gap-4">
            <CornerFrame as="div" className="block shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link.qr}
                alt="Scan to connect your phone"
                width={120}
                height={120}
                className="block size-[120px] bg-white p-1"
                draggable={false}
              />
            </CornerFrame>
            <div className="flex min-w-0 flex-col gap-2">
              <div>
                <span className="font-mono text-[10px] tracking-[0.18em] text-gray-400 uppercase dark:text-neutral-500">
                  code
                </span>
                <p className="font-mono text-[15px] font-semibold tracking-[0.2em] text-gray-900 dark:text-neutral-100">
                  {link.code}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#18A0FB] opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#18A0FB]" />
                </span>
                <span className={cn("font-mono text-[11px]", cardMetaClass)}>
                  listening…
                </span>
              </div>
              <button
                type="button"
                onPointerDown={stopDrag}
                onClick={copyLink}
                className="self-start font-mono text-[11px] font-medium tracking-wide text-[#18A0FB] transition-opacity hover:opacity-80"
              >
                [ {copied ? "copied" : "copy link"} ]
              </button>
            </div>
          </div>
          {link.insecure && (
            <p className="font-mono text-[10px] leading-relaxed text-amber-500/90 dark:text-amber-400/80">
              heads up — this page is on http/localhost. phones (especially
              iPhones) can&apos;t connect over an insecure link. open the deployed
              https site, or an https tunnel, to pair a real phone.
            </p>
          )}
        </div>
      )}

      {/* ── LINKED: drive console ───────────────────────────────────────── */}
      {status === "linked" && (
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-emerald-500">
              <span className="size-2 rounded-full bg-emerald-500" />
              car linked
            </span>
            <button
              type="button"
              onPointerDown={stopDrag}
              onClick={teardown}
              className="font-mono text-[11px] text-gray-400 transition-colors hover:text-red-400 dark:text-neutral-500"
            >
              [ disconnect ]
            </button>
          </div>

          <DPad drive={drive} />

          <div className="flex items-center justify-between gap-3">
            <span className={cn("font-mono text-[11px]", cardMetaClass)}>
              engine: <span className="text-gray-700 dark:text-neutral-200">{note}</span>
            </span>
            <button
              type="button"
              onPointerDown={stopDrag}
              onClick={() => setEngaged((v) => !v)}
              className={cn(
                "border px-3 py-1 font-mono text-[11px] font-medium tracking-[0.16em] uppercase transition-colors",
                engaged
                  ? "border-[#18A0FB] text-[#18A0FB]"
                  : "border-gray-300 text-gray-400 dark:border-neutral-700 dark:text-neutral-500"
              )}
            >
              {engaged ? "keys live" : "engage keys"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <CardChip>↑ / W throttle</CardChip>
            <CardChip>↓ / S reverse</CardChip>
            <CardChip>← → steer</CardChip>
            <CardChip>⇧ / space boost</CardChip>
          </div>
        </div>
      )}
    </CardSurface>
  )
}

// Live D-pad: each arrow lights up brand-blue as its key is held; the hub
// glows when boosting. Mirrors exactly what the car is being told to do.
function DPad({ drive }: { drive: DriveState }) {
  const cell =
    "flex items-center justify-center border font-mono text-[15px] transition-colors duration-75"
  const on = "border-[#18A0FB] bg-[#18A0FB]/15 text-[#18A0FB]"
  const off = "border-gray-200 text-gray-300 dark:border-neutral-700 dark:text-neutral-600"

  const fwd = drive.throttle === "fwd"
  const rev = drive.throttle === "rev"
  const left = drive.steer === "left"
  const right = drive.steer === "right"

  return (
    <div className="flex items-center gap-4">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <span />
        <span className={cn(cell, "size-9", fwd ? on : off)}>↑</span>
        <span />
        <span className={cn(cell, "size-9", left ? on : off)}>←</span>
        <span
          className={cn(
            cell,
            "size-9 rounded-full",
            drive.boost
              ? "border-[#18A0FB] bg-[#18A0FB] text-white"
              : "border-gray-200 text-gray-300 dark:border-neutral-700 dark:text-neutral-600"
          )}
        >
          ●
        </span>
        <span className={cn(cell, "size-9", right ? on : off)}>→</span>
        <span />
        <span className={cn(cell, "size-9", rev ? on : off)}>↓</span>
        <span />
      </div>
      <div className="flex flex-col gap-1 font-mono text-[10px] tracking-wide text-gray-400 dark:text-neutral-500">
        <span>THROTTLE {fwd ? "▲ FWD" : rev ? "▼ REV" : "— idle"}</span>
        <span>STEER {left ? "◀ L" : right ? "R ▶" : "— center"}</span>
        <span className={drive.boost ? "text-[#18A0FB]" : undefined}>
          BOOST {drive.boost ? "ON" : "off"}
        </span>
      </div>
    </div>
  )
}
