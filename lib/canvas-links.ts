import type { CanvasItem } from "@/lib/canvas-config"
import { getExperienceById } from "@/lib/experience"
import { getProjectById } from "@/lib/projects"
import { GITHUB } from "@/lib/github"

export const PEERLIST_PROJECT_URL =
  "https://peerlist.io/10shubham01/project/shubhams-portfolio"

export const RESUME_URL = "/shubham-gupta.pdf"

// Resolves the single external destination a card points at, if it has one.
// The socials card is intentionally excluded: it holds several links, so no
// one URL can stand in for it — its context menu only offers "copy link".
export function getItemExternalUrl(item: CanvasItem): string | null {
  switch (item.component) {
    case "project":
      return getProjectById(item.projectId ?? "")?.href ?? null
    case "work":
      return getExperienceById(item.workId ?? "")?.href ?? null
    case "github":
      return GITHUB.profileUrl
    case "peerlist":
      return PEERLIST_PROJECT_URL
    case "resume-card":
      return RESUME_URL
    default:
      return null
  }
}
