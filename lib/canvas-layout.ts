import { CANVAS_ITEMS } from "@/lib/canvas-config"
import type { Position, Size } from "@/lib/scatter-layout"

const FRAME_LABEL = 24
export const FRAME_GAP = 144
const ANCHOR_SLOP = 8

export const ANCHORED_ITEM_IDS = [
  "now",
  "vscode",
  "awards",
  "project-easybg",
  "github",
  "socials",
  "contact",
  "mcp",
] as const

function getItem(id: string) {
  return CANVAS_ITEMS.find((item) => item.id === id)
}

function anchorAboveLeft(
  anchorId: string,
  targetId: string,
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  const anchor = getItem(anchorId)
  const target = getItem(targetId)
  if (!anchor || !target) {
    return positions[targetId] ?? { x: target?.x ?? 0, y: target?.y ?? 0 }
  }

  const anchorPos = positions[anchorId] ?? { x: anchor.x, y: anchor.y }
  const targetSize = sizes[targetId] ?? { w: target.width, h: target.height }

  return {
    x: anchorPos.x - FRAME_GAP - targetSize.w,
    y: anchorPos.y - FRAME_LABEL - targetSize.h - FRAME_GAP - ANCHOR_SLOP,
  }
}

function anchorBelow(
  anchorId: string,
  targetId: string,
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  const anchor = getItem(anchorId)
  const target = getItem(targetId)
  if (!anchor || !target) {
    return positions[targetId] ?? { x: target?.x ?? 0, y: target?.y ?? 0 }
  }

  const anchorPos = positions[anchorId] ?? { x: anchor.x, y: anchor.y }
  const anchorSize = sizes[anchorId] ?? { w: anchor.width, h: anchor.height }

  return {
    x: target.x,
    y: anchorPos.y + FRAME_LABEL + anchorSize.h + FRAME_GAP + ANCHOR_SLOP,
  }
}

export function getNowPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  return anchorAboveLeft("intro", "now", positions, sizes)
}

export function getVSCodePosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  return anchorBelow("intro", "vscode", positions, sizes)
}

export function getAwardsPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  return anchorBelow("vscode", "awards", positions, sizes)
}

export function getEasybgPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  return anchorBelow("awards", "project-easybg", positions, sizes)
}

export function getSocialsPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  return anchorBelow("github", "socials", positions, sizes)
}

export function getGitHubPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  const workCredilio = getItem("work-credilio")
  const github = getItem("github")
  if (!workCredilio || !github) {
    return positions.github ?? { x: github?.x ?? 700, y: github?.y ?? 0 }
  }

  const workPos = positions["work-credilio"] ?? { x: workCredilio.x, y: workCredilio.y }
  const workSize = sizes["work-credilio"] ?? { w: workCredilio.width, h: workCredilio.height }

  return {
    x: github.x,
    y: workPos.y + FRAME_LABEL + workSize.h + FRAME_GAP + ANCHOR_SLOP,
  }
}

export function getContactPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  const github = getItem("github")
  const contact = getItem("contact")
  if (!github || !contact) {
    return positions.contact ?? { x: contact?.x ?? 0, y: contact?.y ?? 0 }
  }

  const githubPos = positions.github ?? { x: github.x, y: github.y }
  const githubSize = sizes.github ?? { w: github.width, h: github.height }

  // github is a wide card that the anchored layout pushes down beneath the
  // work cards; sitting the contact slip to its right (with the standard frame
  // gap) keeps the two from overlapping no matter how tall the work column gets.
  return {
    x: githubPos.x + githubSize.w + FRAME_GAP,
    y: githubPos.y,
  }
}

export function getMcpPosition(
  positions: Record<string, Position>,
  sizes: Record<string, Size>
): Position {
  const contact = getItem("contact")
  const mcp = getItem("mcp")
  if (!contact || !mcp) {
    return positions.mcp ?? { x: mcp?.x ?? 0, y: mcp?.y ?? 0 }
  }

  const contactPos = positions.contact ?? { x: contact.x, y: contact.y }
  const contactSize = sizes.contact ?? { w: contact.width, h: contact.height }

  // Contact itself is anchored to github's right at runtime, so the MCP card
  // chains off contact's resolved position rather than its static config.
  return {
    x: contactPos.x + contactSize.w + FRAME_GAP,
    y: contactPos.y,
  }
}

export function withAnchoredLayout(
  positions: Record<string, Position>,
  sizes: Record<string, Size>,
  options?: { anchorToIntro?: boolean }
): Record<string, Position> {
  const anchorToIntro = options?.anchorToIntro ?? true
  const withVSCode = anchorToIntro
    ? (() => {
        const withNow = { ...positions, now: getNowPosition(positions, sizes) }
        return { ...withNow, vscode: getVSCodePosition(withNow, sizes) }
      })()
    : positions

  const withAwards = {
    ...withVSCode,
    awards: getAwardsPosition(withVSCode, sizes),
  }
  const withEasybg = {
    ...withAwards,
    "project-easybg": getEasybgPosition(withAwards, sizes),
  }
  const withGitHub = {
    ...withEasybg,
    github: getGitHubPosition(withEasybg, sizes),
  }
  const withSocials = {
    ...withGitHub,
    socials: getSocialsPosition(withGitHub, sizes),
  }

  const withContact = {
    ...withSocials,
    contact: getContactPosition(withSocials, sizes),
  }

  return {
    ...withContact,
    mcp: getMcpPosition(withContact, sizes),
  }
}
