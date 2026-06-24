"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { DataConnection, Peer as PeerInstance } from "peerjs"
import {
  IDLE_STATE,
  RC_HOST_PARAM,
  isDriveMessage,
  isEngineRunning,
  vibrationFor,
  type DriveState,
} from "@/lib/rc-car"
import { EngineSound } from "@/lib/engine-audio"
import { PixelCar } from "@/components/portfolio/pixel-car"

const BLUE = "#18A0FB"
const CONNECT_TIMEOUT_MS = 12000

type Phase = "intro" | "connecting" | "linked" | "lost" | "error" | "no-host" | "insecure"

// Display speed/RPM for the dashboard, derived from the drive state.
function readout(state: DriveState): { speed: number; label: string } {
  if (state.throttle === "fwd") return { speed: state.boost ? 100 : 64, label: state.boost ? "BOOST" : "DRIVE" }
  if (state.throttle === "rev") return { speed: state.boost ? -48 : -30, label: "REVERSE" }
  if (state.steer !== "center") return { speed: 12, label: "STEER" }
  return { speed: 0, label: "IDLE" }
}

export default function DrivePage() {
  const peerRef = useRef<PeerInstance | null>(null)
  const connRef = useRef<DataConnection | null>(null)
  const vibeTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const dialTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const engineRef = useRef<EngineSound | null>(null)
  const hostRef = useRef<string | null>(null)

  const [phase, setPhase] = useState<Phase>("intro")
  const [drive, setDrive] = useState<DriveState>(IDLE_STATE)
  const [canVibrate, setCanVibrate] = useState(true)

  // Resolve the environment once mounted: host id, vibration support, and —
  // critically — whether we're on a secure origin. iOS blocks WebRTC entirely
  // over plain http, which is the #1 reason "nothing happens" on an iPhone.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const host = params.get(RC_HOST_PARAM)
    hostRef.current = host

    if (!("vibrate" in navigator)) setCanVibrate(false)

    if (!host) {
      setPhase("no-host")
    } else if (!window.isSecureContext || typeof RTCPeerConnection === "undefined") {
      setPhase("insecure")
    }
  }, [])

  // Apply a drive state to both outputs: the vibration motor and the audio
  // engine. Either may be unavailable; whatever exists responds.
  const applyDrive = useCallback((state: DriveState) => {
    engineRef.current?.update(state)

    if (vibeTimer.current) {
      clearInterval(vibeTimer.current)
      vibeTimer.current = null
    }
    if (!("vibrate" in navigator)) return
    if (!isEngineRunning(state)) {
      navigator.vibrate(0)
      return
    }
    const { pattern, cycle } = vibrationFor(state)
    navigator.vibrate(pattern)
    vibeTimer.current = setInterval(() => navigator.vibrate(pattern), cycle)
  }, [])

  const clearDialTimer = () => {
    if (dialTimer.current) clearTimeout(dialTimer.current)
    dialTimer.current = null
  }

  const stopAll = useCallback(() => {
    clearDialTimer()
    if (vibeTimer.current) clearInterval(vibeTimer.current)
    vibeTimer.current = null
    if ("vibrate" in navigator) navigator.vibrate(0)
    engineRef.current?.silence()
    connRef.current?.close()
    peerRef.current?.destroy()
    connRef.current = null
    peerRef.current = null
  }, [])

  useEffect(
    () => () => {
      stopAll()
      engineRef.current?.dispose()
      engineRef.current = null
    },
    [stopAll]
  )

  // Start engine: the tap is the gesture browsers require to unlock audio (and
  // vibration), and the trigger to dial the host.
  const start = useCallback(async () => {
    const host = hostRef.current
    if (!host) return setPhase("no-host")
    if (!window.isSecureContext || typeof RTCPeerConnection === "undefined") {
      return setPhase("insecure")
    }

    // Unlock the audio engine inside the gesture, plus a confirming buzz.
    if (!engineRef.current) engineRef.current = new EngineSound()
    await engineRef.current.start()
    if ("vibrate" in navigator) navigator.vibrate(40)

    setPhase("connecting")

    // Bail out with a clear message if the link never opens.
    clearDialTimer()
    dialTimer.current = setTimeout(() => {
      stopAll()
      setPhase("error")
    }, CONNECT_TIMEOUT_MS)

    try {
      const { default: Peer } = await import("peerjs")
      const peer = new Peer()
      peerRef.current = peer

      peer.on("open", () => {
        const conn = peer.connect(host, { reliable: false })
        connRef.current = conn

        conn.on("open", () => {
          clearDialTimer()
          conn.send({ t: "hello", role: "car" })
          setPhase("linked")
        })
        conn.on("data", (raw) => {
          if (!isDriveMessage(raw)) return
          const next: DriveState = { throttle: raw.throttle, steer: raw.steer, boost: raw.boost }
          setDrive(next)
          applyDrive(next)
        })
        conn.on("close", () => {
          applyDrive(IDLE_STATE)
          setDrive(IDLE_STATE)
          setPhase("lost")
        })
        conn.on("error", () => {
          clearDialTimer()
          setPhase("error")
        })
      })

      peer.on("error", () => {
        clearDialTimer()
        setPhase("error")
      })
    } catch {
      clearDialTimer()
      setPhase("error")
    }
  }, [applyDrive, stopAll])

  const { speed, label } = readout(drive)
  const note = vibrationFor(drive).note
  const running = isEngineRunning(drive)
  const gear = drive.throttle === "fwd" ? "D" : drive.throttle === "rev" ? "R" : "N"
  const speedPct = Math.min(1, Math.abs(speed) / 100)

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-neutral-950 px-5 py-6 text-neutral-100 select-none">
      {/* Blueprint grid backdrop + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(${BLUE}22 1px, transparent 1px), linear-gradient(90deg, ${BLUE}22 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)" }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        <header className="flex w-full items-center justify-between font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: BLUE }} />
            phone · rc
          </span>
          <StatusPill phase={phase} />
        </header>

        {/* ── Intro — arcade "press start" ────────────────────────────── */}
        {phase === "intro" && (
          <div className="flex flex-col items-center gap-7 py-8 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[10px] tracking-[0.4em] text-neutral-500 uppercase">
                player one
              </span>
              <h1
                className="font-mono text-3xl font-bold tracking-[0.15em] uppercase"
                style={{ color: BLUE, textShadow: `0 0 16px ${BLUE}66` }}
              >
                RC Racer
              </h1>
            </div>
            <p className="max-w-[17rem] font-mono text-[12px] leading-relaxed text-neutral-400">
              Your phone is the car. Hit start, then drive it from the desktop
              keyboard — you&apos;ll{" "}
              {canVibrate ? "feel it buzz and hear it rev." : "hear the engine rev."}
            </p>
            <button
              type="button"
              onClick={start}
              className="rc-blink border-2 px-7 py-3 font-mono text-[13px] font-bold tracking-[0.22em] uppercase transition-transform active:scale-95"
              style={{ borderColor: BLUE, color: BLUE, boxShadow: `0 0 30px ${BLUE}40` }}
            >
              ▸ press start ◂
            </button>
            {!canVibrate && (
              <p className="max-w-[16rem] font-mono text-[11px] leading-relaxed text-neutral-500">
                this browser can&apos;t vibrate (iOS blocks it) — so you&apos;ll
                drive by ear. turn the ringer up.
              </p>
            )}
          </div>
        )}

        {phase === "connecting" && (
          <p className="rc-blink py-16 font-mono text-[12px] tracking-[0.2em] text-neutral-400 uppercase">
            linking to remote…
          </p>
        )}

        {phase === "no-host" && (
          <p className="max-w-[18rem] py-16 text-center font-mono text-[12px] leading-relaxed text-amber-400/80">
            no remote in the link. open the Phone RC card on the desktop and scan
            its QR code to pair.
          </p>
        )}

        {phase === "insecure" && (
          <div className="flex max-w-[19rem] flex-col items-center gap-4 py-12 text-center">
            <p className="font-mono text-[12px] leading-relaxed text-amber-400/90">
              this page is open over plain <span className="font-bold">http</span> —
              iOS blocks the WebRTC connection on insecure links, so it can&apos;t
              connect.
            </p>
            <p className="font-mono text-[11px] leading-relaxed text-neutral-500">
              open it over <span className="font-bold text-neutral-300">https</span> (the
              deployed site, or an https tunnel) and scan the QR again.
            </p>
          </div>
        )}

        {(phase === "error" || phase === "lost") && (
          <div className="flex flex-col items-center gap-5 py-12 text-center">
            <p className="font-mono text-[12px] tracking-wide text-neutral-400 uppercase">
              {phase === "lost" ? "remote disconnected" : "couldn't reach the remote"}
            </p>
            <button
              type="button"
              onClick={start}
              className="border-2 px-5 py-2 font-mono text-[12px] font-bold tracking-[0.18em] uppercase active:scale-95"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              reconnect
            </button>
          </div>
        )}

        {/* ── Linked — arcade console with the pixel car ──────────────── */}
        {phase === "linked" && (
          <div className="flex w-full flex-col gap-4">
            {/* CRT screen housing the pixel-art scene */}
            <div
              className="relative w-full overflow-hidden border-2"
              style={{
                borderColor: BLUE,
                aspectRatio: "2 / 3",
                boxShadow: `0 0 28px ${BLUE}40, inset 0 0 40px rgba(0,0,0,0.6)`,
              }}
            >
              <PixelCar state={drive} />

              {/* CRT scanlines */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* corner crop ticks */}
              {[
                "top-1 left-1 border-t-2 border-l-2",
                "top-1 right-1 border-t-2 border-r-2",
                "bottom-1 left-1 border-b-2 border-l-2",
                "bottom-1 right-1 border-b-2 border-r-2",
              ].map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={`pointer-events-none absolute size-3 ${pos}`}
                  style={{ borderColor: BLUE }}
                />
              ))}

              {/* HUD — top: gear + boost */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5 font-mono">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] tracking-[0.25em] text-neutral-400">GEAR</span>
                  <span
                    className="text-2xl leading-none font-bold"
                    style={{ color: BLUE, textShadow: `0 0 10px ${BLUE}` }}
                  >
                    {gear}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[8px] tracking-[0.25em] text-neutral-400">BOOST</span>
                  <span
                    className="text-sm font-bold tracking-[0.2em]"
                    style={{
                      color: drive.boost ? "#ffd23f" : "#3f3f46",
                      textShadow: drive.boost ? "0 0 10px #ffd23f" : "none",
                    }}
                  >
                    {drive.boost ? "▮▮▮" : "▯▯▯"}
                  </span>
                </div>
              </div>

              {/* HUD — bottom: speed + segmented bar */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-2.5 font-mono">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl leading-none font-bold tabular-nums"
                    style={{ color: running ? BLUE : "#52525b", textShadow: running ? `0 0 10px ${BLUE}66` : "none" }}
                  >
                    {Math.abs(speed)}
                  </span>
                  <span className="text-[8px] tracking-[0.25em] text-neutral-400">{label}</span>
                </div>
                <div className="flex gap-[2px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-3 w-1.5"
                      style={{
                        backgroundColor:
                          i / 10 < speedPct ? (i >= 8 ? "#ffd23f" : BLUE) : "#24242c",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Control strip — input mirror + engine note + stop */}
            <div className="flex items-center justify-between gap-3">
              <InputPad drive={drive} />
              <div className="flex flex-col items-end gap-1 font-mono text-[10px] tracking-wide text-neutral-500">
                <span className="text-neutral-300">{note}</span>
                <span className="text-neutral-600">{canVibrate ? "buzz + sound" : "sound"}</span>
                <button
                  type="button"
                  onClick={stopAll}
                  className="mt-0.5 text-neutral-500 transition-colors hover:text-red-400"
                >
                  [ stop ]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes rc-blink { 0%, 65% { opacity: 1 } 66%, 100% { opacity: 0.35 } } .rc-blink { animation: rc-blink 1.1s steps(1) infinite }`}</style>
    </main>
  )
}

function StatusPill({ phase }: { phase: Phase }) {
  const map: Record<Phase, { text: string; color: string }> = {
    intro: { text: "ready", color: "#a1a1aa" },
    connecting: { text: "linking", color: BLUE },
    linked: { text: "linked", color: "#10b981" },
    lost: { text: "lost", color: "#f59e0b" },
    error: { text: "error", color: "#ef4444" },
    "no-host": { text: "no host", color: "#f59e0b" },
    insecure: { text: "http", color: "#f59e0b" },
  }
  const { text, color } = map[phase]
  return (
    <span className="inline-flex items-center gap-1.5" style={{ color }}>
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {text}
    </span>
  )
}

// Compact d-pad mirroring the keys held on the remote.
function InputPad({ drive }: { drive: DriveState }) {
  const cell = "flex size-7 items-center justify-center border font-mono text-xs transition-all duration-75"
  const lit = (on: boolean) =>
    on
      ? { borderColor: BLUE, backgroundColor: `${BLUE}22`, color: BLUE }
      : { borderColor: "#2a2a32", color: "#3f3f46" }
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1">
      <span />
      <span className={cell} style={lit(drive.throttle === "fwd")}>↑</span>
      <span />
      <span className={cell} style={lit(drive.steer === "left")}>←</span>
      <span
        className="flex size-7 items-center justify-center rounded-full border text-[10px]"
        style={
          drive.boost
            ? { borderColor: "#ffd23f", backgroundColor: "#ffd23f", color: "#0a0a0a" }
            : { borderColor: "#2a2a32", color: "#3f3f46" }
        }
      >
        ●
      </span>
      <span className={cell} style={lit(drive.steer === "right")}>→</span>
      <span />
      <span className={cell} style={lit(drive.throttle === "rev")}>↓</span>
      <span />
    </div>
  )
}
