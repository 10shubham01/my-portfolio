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

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-neutral-100 select-none">
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `linear-gradient(${BLUE}22 1px, transparent 1px), linear-gradient(90deg, ${BLUE}22 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
        <header className="flex w-full items-center justify-between font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: BLUE }} />
            phone · rc
          </span>
          <StatusPill phase={phase} />
        </header>

        {/* ── Intro / connect states ──────────────────────────────────── */}
        {phase === "intro" && (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <p className="font-mono text-[13px] leading-relaxed text-neutral-400">
              Your phone is the car. Tap to start the engine, then drive it from
              the desktop with the keyboard — you&apos;ll hear it rev
              {canVibrate ? " and feel every bump." : "."}
            </p>
            <button
              type="button"
              onClick={start}
              className="flex size-32 items-center justify-center rounded-full border-2 font-mono text-[13px] font-bold tracking-[0.2em] uppercase transition-transform active:scale-95"
              style={{ borderColor: BLUE, color: BLUE, boxShadow: `0 0 40px ${BLUE}33` }}
            >
              Start
              <br />
              engine
            </button>
            {!canVibrate && (
              <p className="max-w-[16rem] font-mono text-[11px] leading-relaxed text-neutral-500">
                this browser can&apos;t vibrate (iOS blocks it) — so you&apos;ll
                drive by ear with the engine sound. turn the ringer up.
              </p>
            )}
          </div>
        )}

        {phase === "connecting" && (
          <p className="py-16 font-mono text-[12px] tracking-wide text-neutral-400">
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
            <p className="font-mono text-[12px] text-neutral-400">
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

        {/* ── Live dashboard ──────────────────────────────────────────── */}
        {phase === "linked" && (
          <>
            {/* Motor disc — scales + glows with the engine */}
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 transition-all duration-100"
                style={{
                  borderColor: running ? BLUE : "#3f3f46",
                  transform: `scale(${running ? (drive.boost ? 1.06 : 1.02) : 1})`,
                  boxShadow: running ? `0 0 ${drive.boost ? 60 : 32}px ${BLUE}55` : "none",
                  animation: running ? "rc-rev 0.25s linear infinite" : "none",
                }}
              />
              <div className="flex flex-col items-center">
                <span className="font-mono text-5xl font-bold tabular-nums" style={{ color: running ? BLUE : "#52525b" }}>
                  {Math.abs(speed)}
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
                  {label}
                </span>
              </div>
            </div>

            {/* Direction cluster — mirrors the keys held on the remote */}
            <div className="grid grid-cols-3 grid-rows-3 gap-2">
              <span />
              <Arrow on={drive.throttle === "fwd"}>↑</Arrow>
              <span />
              <Arrow on={drive.steer === "left"}>←</Arrow>
              <span
                className="flex size-12 items-center justify-center rounded-full border-2 font-mono text-lg transition-all"
                style={
                  drive.boost
                    ? { borderColor: BLUE, backgroundColor: BLUE, color: "#0a0a0a" }
                    : { borderColor: "#3f3f46", color: "#52525b" }
                }
              >
                ●
              </span>
              <Arrow on={drive.steer === "right"}>→</Arrow>
              <span />
              <Arrow on={drive.throttle === "rev"}>↓</Arrow>
              <span />
            </div>

            <div className="flex w-full items-center justify-between font-mono text-[11px] tracking-wide text-neutral-500">
              <span>
                engine: <span className="text-neutral-200">{note}</span>
                <span className="text-neutral-600"> · {canVibrate ? "buzz + sound" : "sound"}</span>
              </span>
              <button type="button" onClick={stopAll} className="text-neutral-500 hover:text-red-400">
                [ stop ]
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes rc-rev { 0%,100% { rotate: 0deg } 50% { rotate: 1.2deg } }`}</style>
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

function Arrow({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className="flex size-12 items-center justify-center border-2 font-mono text-lg transition-all duration-75"
      style={
        on
          ? { borderColor: BLUE, backgroundColor: `${BLUE}22`, color: BLUE }
          : { borderColor: "#3f3f46", color: "#52525b" }
      }
    >
      {children}
    </span>
  )
}
