export type TourStep = {
  /** Canvas item id to focus for this step. */
  id: string
  /** Short caption shown in the tour bubble. */
  caption: string
}

/**
 * A narrative walkthrough of the board for first-time visitors who land on an
 * infinite canvas and don't know where to start. Order tells a story:
 * who → where I've worked → what I've built → proof → how to reach me.
 *
 * Every id must exist in data/canvas-items.json; unknown ids are skipped at
 * runtime so the tour stays resilient to content edits.
 */
export const CANVAS_TOUR: TourStep[] = [
  { id: "intro", caption: "Hey — I'm Shubham. Welcome to the board. Let me show you around." },
  { id: "now", caption: "What I'm focused on right now." },
  { id: "work-webmd", caption: "Currently building health-tech tooling at WebMD." },
  { id: "work-credilio", caption: "Before that, fintech platform work at Credilio." },
  { id: "skills", caption: "The stack I reach for, day to day." },
  { id: "project-spotlight", caption: "A favourite side project — and yes, this canvas has one too (⌘K)." },
  { id: "project-scut-cli", caption: "scut — a CLI I built to speed up everyday dev work." },
  { id: "github", caption: "How the commits stack up over the year." },
  { id: "awards", caption: "A few things I'm proud of." },
  { id: "socials", caption: "That's the tour — here's where to find me. Say hi!" },
]

/** Auto-advance delay (ms) per step when the tour plays hands-free. */
export const TOUR_STEP_DURATION = 4200
