// Single source of truth for "the Phone RC card currently owns the keyboard".
//
// The card's driving keys (WASD / arrows / D / S / Shift) collide with the
// canvas's own shortcuts (theme toggle on D, summon on S, arrow-key card
// cycling, the konami sequence). Both sets of handlers live on `window`, so
// preventDefault alone can't stop the canvas ones. Instead the card raises this
// flag while it's the active card, and the canvas handlers bail when it's set.
//
// A module-level singleton is enough: there is only ever one canvas + one card.

let capturing = false

export function setRcCapturing(value: boolean) {
  capturing = value
}

export function isRcCapturing() {
  return capturing
}
