// A tiny Web Audio engine-rev synth for the /drive car.
//
// iOS Safari ships no Vibration API, so the haptic "engine" can never fire on
// an iPhone. Sound, however, works everywhere — so the car also *sounds* like
// an engine: two detuned sawtooths through a lowpass filter, with pitch,
// brightness, and volume driven by the same DriveState the motor uses.
//
// The AudioContext must be created/resumed inside a user gesture (the "Start
// engine" tap), which is exactly where start() is called.

import { isEngineRunning, type DriveState } from "@/lib/rc-car"

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

interface Voice {
  freq: number // base oscillator frequency
  cutoff: number // lowpass cutoff — higher reads as "brighter / harder"
  gain: number // master volume (0 = silent)
}

function voiceFor(state: DriveState): Voice {
  if (state.throttle === "fwd") {
    return state.boost
      ? { freq: 215, cutoff: 1700, gain: 0.3 }
      : { freq: 135, cutoff: 1050, gain: 0.22 }
  }
  if (state.throttle === "rev") {
    return state.boost
      ? { freq: 115, cutoff: 820, gain: 0.22 }
      : { freq: 95, cutoff: 700, gain: 0.18 }
  }
  // Coasting through a turn — a light, mid note.
  if (state.steer !== "center") return { freq: 90, cutoff: 650, gain: 0.13 }
  // Engine off.
  return { freq: 70, cutoff: 350, gain: 0 }
}

export class EngineSound {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private oscs: OscillatorNode[] = []

  /** True only after a successful start() — i.e. audio is actually available. */
  get ready() {
    return this.ctx !== null
  }

  /** Build (or resume) the audio graph. Must run inside a user gesture on iOS. */
  async start(): Promise<boolean> {
    if (this.ctx) {
      await this.ctx.resume().catch(() => {})
      return true
    }
    const Ctor = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!Ctor) return false

    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = 0

    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 350
    filter.Q.value = 6

    // Two slightly detuned sawtooths give the note some chordal "grit".
    for (const detune of [0, 8]) {
      const osc = ctx.createOscillator()
      osc.type = "sawtooth"
      osc.frequency.value = 70
      osc.detune.value = detune
      osc.connect(filter)
      osc.start()
      this.oscs.push(osc)
    }
    filter.connect(master)
    master.connect(ctx.destination)

    this.ctx = ctx
    this.master = master
    this.filter = filter
    await ctx.resume().catch(() => {})
    return true
  }

  /** Glide the engine note toward the target for the given drive state. */
  update(state: DriveState) {
    if (!this.ctx || !this.master || !this.filter) return
    const t = this.ctx.currentTime
    const v = isEngineRunning(state) ? voiceFor(state) : voiceFor({ ...state, throttle: "idle", steer: "center", boost: false })

    this.oscs.forEach((osc, i) => {
      // Second voice sits a fifth up so the engine reads as a richer note.
      osc.frequency.setTargetAtTime(v.freq * (i === 0 ? 1 : 1.5), t, 0.07)
    })
    this.filter.frequency.setTargetAtTime(v.cutoff, t, 0.08)
    this.master.gain.setTargetAtTime(v.gain, t, 0.04)
  }

  /** Fade to silence without tearing down the graph. */
  silence() {
    if (!this.ctx || !this.master) return
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05)
  }

  /** Stop oscillators and close the context. */
  dispose() {
    this.oscs.forEach((osc) => {
      try {
        osc.stop()
      } catch {
        /* already stopped */
      }
    })
    this.ctx?.close().catch(() => {})
    this.ctx = null
    this.master = null
    this.filter = null
    this.oscs = []
  }
}
