// Shared protocol + vibration model for the "phone as RC car" gadget.
//
// The desktop card is the REMOTE: it hosts a PeerJS peer and streams DriveState
// over a WebRTC data channel. The /drive page is the CAR: it joins that peer
// and turns each DriveState into a vibration pattern, so the phone's motor
// becomes the engine you can feel through the keys.
//
// This module is import-safe on both sides — no browser-only globals at the
// top level.

/** Query-string key the remote encodes its peer id under: /drive?h=<peerId> */
export const RC_HOST_PARAM = "h"

/** Fixed PeerJS id prefix so generated ids read as ours, not random UUIDs. */
const PEER_PREFIX = "shubham-rc-"

export type Throttle = "fwd" | "rev" | "idle"
export type Steer = "left" | "right" | "center"

export interface DriveState {
  throttle: Throttle
  steer: Steer
  boost: boolean
}

export const IDLE_STATE: DriveState = {
  throttle: "idle",
  steer: "center",
  boost: false,
}

// ── Wire protocol ──────────────────────────────────────────────────────────
// Tiny tagged messages; both ends ignore anything they don't recognise.

export interface DriveMessage extends DriveState {
  t: "drive"
  /** Monotonic sequence so the car can drop out-of-order packets. */
  seq: number
}

export interface HelloMessage {
  t: "hello"
  role: "remote" | "car"
}

export type RcMessage = DriveMessage | HelloMessage

export function isDriveMessage(msg: unknown): msg is DriveMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as { t?: unknown }).t === "drive"
  )
}

export function isHelloMessage(msg: unknown): msg is HelloMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as { t?: unknown }).t === "hello"
  )
}

/** Mint a fresh, readable peer id for the remote to host under. */
export function createPeerId(): string {
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  const code = Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 8)
  return `${PEER_PREFIX}${code}`
}

/** The short pairing code shown to the user (the bit after the prefix). */
export function shortCode(peerId: string): string {
  return peerId.replace(PEER_PREFIX, "").toUpperCase()
}

/** Build the /drive link a phone opens to join this remote. */
export function driveUrl(origin: string, peerId: string): string {
  return `${origin}/drive?${RC_HOST_PARAM}=${encodeURIComponent(peerId)}`
}

// ── Keyboard → DriveState ────────────────────────────────────────────────────

/** Map a held key (lowercased `event.key`) to the control it drives, or null. */
export function controlForKey(key: string): keyof DriveState | "fwd" | "rev" | "left" | "right" | null {
  switch (key) {
    case "arrowup":
    case "w":
      return "fwd"
    case "arrowdown":
    case "s":
      return "rev"
    case "arrowleft":
    case "a":
      return "left"
    case "arrowright":
    case "d":
      return "right"
    case "shift":
    case " ":
      return "boost"
    default:
      return null
  }
}

/** Keys we own while engaged — used to call preventDefault and avoid scrolling. */
export const DRIVE_KEYS = new Set([
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "w",
  "a",
  "s",
  "d",
  " ",
  "shift",
])

/** Collapse the set of currently-pressed keys into a single DriveState. */
export function stateFromKeys(pressed: Set<string>): DriveState {
  const up = pressed.has("arrowup") || pressed.has("w")
  const down = pressed.has("arrowdown") || pressed.has("s")
  const left = pressed.has("arrowleft") || pressed.has("a")
  const right = pressed.has("arrowright") || pressed.has("d")
  const boost = pressed.has("shift") || pressed.has(" ")

  const throttle: Throttle = up && !down ? "fwd" : down && !up ? "rev" : "idle"
  const steer: Steer = left && !right ? "left" : right && !left ? "right" : "center"

  return { throttle, steer, boost }
}

// ── DriveState → vibration ───────────────────────────────────────────────────
//
// The vibration motor is binary (on/off), so "intensity" is faked with a duty
// cycle: a buzzier pattern (more on-time per cycle) reads as more power. Each
// pattern is an even-length [on, off, on, off, …] array re-fired every `cycle`
// ms by the car so the engine note sustains while a key is held.

export interface VibePattern {
  /** navigator.vibrate() pattern — alternating on/off durations in ms. */
  pattern: number[]
  /** Total cycle length; the car re-fires `pattern` every `cycle` ms. */
  cycle: number
  /** Human-readable engine note, surfaced on both dashboards. */
  note: string
}

/** Engine is off when nothing is being asked of it. */
export function isEngineRunning(state: DriveState): boolean {
  return state.throttle !== "idle" || state.steer !== "center" || state.boost
}

export function vibrationFor(state: DriveState): VibePattern {
  const { throttle, steer, boost } = state

  // Idle but engaged elsewhere (e.g. only steering): soft tick-over.
  if (throttle === "idle" && !boost) {
    if (steer === "center") return { pattern: [0], cycle: 1000, note: "engine off" }
    // Steering while coasting: a clean blinker-like tick.
    return { pattern: [30, 120, 30, 320], cycle: 500, note: "coasting · turn" }
  }

  // Base engine note from throttle, widened by boost.
  let pattern: number[]
  let note: string
  if (throttle === "rev") {
    // Reverse: a lower, stuttering note so it feels different from forward.
    pattern = boost ? [80, 40, 80, 160] : [50, 70, 50, 200]
    note = boost ? "reverse · hard" : "reverse"
  } else if (boost) {
    // Forward + boost: near-continuous, the strongest buzz.
    pattern = [220, 25]
    note = "boost"
  } else {
    // Forward cruise.
    pattern = [70, 60]
    note = "forward"
  }

  // Steering overlays a sharp accent pulse on top of the engine note.
  if (steer !== "center") {
    pattern = [...pattern, 25, 90, 25, 0]
    note = `${note} · ${steer}`
  }

  const cycle = pattern.reduce((sum, ms) => sum + ms, 0)
  return { pattern, cycle, note }
}
