import githubJson from "@/data/github.json"

export const GITHUB = githubJson

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface GitHubContribution {
  date: string
  count: number
  level: ContributionLevel
}

export interface GitHubContributionsResponse {
  contributions: GitHubContribution[]
  total?: {
    lastYear?: number
  }
}

export async function fetchGitHubContributions(username: string) {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub contributions")
  }

  return (await response.json()) as GitHubContributionsResponse
}

export function groupContributionsByWeek(contributions: GitHubContribution[]) {
  if (!contributions.length) return []

  const weeks: (GitHubContribution | null)[][] = []
  let currentWeek: (GitHubContribution | null)[] = []

  const firstDate = new Date(`${contributions[0].date}T12:00:00`)
  for (let index = 0; index < firstDate.getDay(); index++) {
    currentWeek.push(null)
  }

  for (const contribution of contributions) {
    currentWeek.push(contribution)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  return weeks
}

export const CONTRIBUTION_COLORS = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
} as const

export const GITHUB_GRAPH_CELL = 10
export const GITHUB_GRAPH_GAP = 2
export const GITHUB_CARD_PAD_TOP = 24
export const GITHUB_CARD_PAD_BOTTOM = 16 // pb-4
export const GITHUB_HEADER_HEIGHT = 20
export const GITHUB_BLOCK_GAP = 16 // mt-4
export const GITHUB_FOOTER_HEIGHT = 16 // single footer row
export const GITHUB_GRAPH_WEEKS_FALLBACK = 53

export function getGitHubGraphWidth(weekCount: number) {
  if (weekCount <= 0) return 0
  return weekCount * GITHUB_GRAPH_CELL + (weekCount - 1) * GITHUB_GRAPH_GAP
}

export function getGitHubGraphHeight() {
  return 7 * GITHUB_GRAPH_CELL + 6 * GITHUB_GRAPH_GAP
}

export function getGitHubCardDimensions(weekCount: number) {
  const weeks = weekCount > 0 ? weekCount : GITHUB_GRAPH_WEEKS_FALLBACK
  const graphWidth = getGitHubGraphWidth(weeks)
  const graphHeight = getGitHubGraphHeight()

  return {
    graphWidth,
    width: graphWidth + GITHUB_CARD_PAD_TOP * 2,
    height:
      GITHUB_CARD_PAD_TOP +
      GITHUB_HEADER_HEIGHT +
      GITHUB_BLOCK_GAP +
      graphHeight +
      GITHUB_BLOCK_GAP +
      GITHUB_FOOTER_HEIGHT +
      GITHUB_CARD_PAD_BOTTOM,
  }
}
