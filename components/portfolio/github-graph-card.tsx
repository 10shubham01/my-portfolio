"use client"

import { useEffect, useState } from "react"
import {
  CardSectionTitle,
  CardSurface,
  cardLinkClass,
  cardMetaClass,
} from "@/components/portfolio/card-chrome"
import { useFrameResize } from "@/components/portfolio/use-frame-resize"
import { useTheme } from "@/components/portfolio/theme-provider"
import {
  CONTRIBUTION_COLORS,
  fetchGitHubContributions,
  getGitHubCardDimensions,
  getGitHubGraphWidth,
  GITHUB,
  GITHUB_GRAPH_WEEKS_FALLBACK,
  groupContributionsByWeek,
  type GitHubContribution,
} from "@/lib/github"

function ContributionGrid({
  contributions,
  isDark,
  graphWidth,
}: {
  contributions: GitHubContribution[]
  isDark: boolean
  graphWidth: number
}) {
  const weeks = groupContributionsByWeek(contributions)
  const palette = isDark ? CONTRIBUTION_COLORS.dark : CONTRIBUTION_COLORS.light

  return (
    <div className="flex gap-[2px]" style={{ width: graphWidth }}>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[2px]">
          {week.map((day, dayIndex) => {
            const level = day?.level ?? 0
            const title = day
              ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
              : undefined

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                title={title}
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{ backgroundColor: palette[level] }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function GraphSkeleton({ isDark, graphWidth }: { isDark: boolean; graphWidth: number }) {
  const palette = isDark ? CONTRIBUTION_COLORS.dark : CONTRIBUTION_COLORS.light
  const weekCount = Math.max(
    1,
    Math.round((graphWidth + 2) / (10 + 2))
  )

  return (
    <div className="flex gap-[2px]" style={{ width: graphWidth }}>
      {Array.from({ length: weekCount }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[2px]">
          {Array.from({ length: 7 }).map((__, dayIndex) => (
            <div
              key={dayIndex}
              className="h-[10px] w-[10px] animate-pulse rounded-[2px]"
              style={{
                backgroundColor: palette[0],
                opacity: 0.45 + ((weekIndex + dayIndex) % 3) * 0.15,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function GitHubGraphCard({
  interactive,
  onResize,
}: {
  interactive: boolean
  onResize?: (width: number, height: number) => void
}) {
  const { isDark } = useTheme()
  const [contributions, setContributions] = useState<GitHubContribution[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const weekCount = loading
    ? GITHUB_GRAPH_WEEKS_FALLBACK
    : groupContributionsByWeek(contributions).length || GITHUB_GRAPH_WEEKS_FALLBACK

  const { graphWidth } = getGitHubCardDimensions(weekCount)
  const ref = useFrameResize(onResize)

  useEffect(() => {
    let cancelled = false

    fetchGitHubContributions(GITHUB.username)
      .then((data) => {
        if (cancelled) return
        setContributions(data.contributions)
        setTotal(data.total?.lastYear ?? null)
        setError(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <CardSurface ref={ref} interactive={interactive} className="box-border w-full !px-6 !pt-6 !pb-4">
      <div className="flex items-start justify-between gap-3">
        <CardSectionTitle>GitHub</CardSectionTitle>
        <a
          href={GITHUB.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-[11px] text-gray-400 transition-colors hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          @{GITHUB.username}
        </a>
      </div>

      <div className="mt-4" style={{ width: graphWidth }}>
        {loading && <GraphSkeleton isDark={isDark} graphWidth={graphWidth} />}
        {!loading && error && (
          <p className={cardMetaClass}>Could not load contribution graph.</p>
        )}
        {!loading && !error && (
          <ContributionGrid
            contributions={contributions}
            isDark={isDark}
            graphWidth={graphWidth}
          />
        )}
      </div>

      <div
        className="mt-4 flex items-center justify-between gap-3"
        style={{ width: graphWidth }}
      >
        <p className={`${cardMetaClass}${total !== null ? " min-w-0 truncate" : ""}`}>
          {total !== null
            ? `${total.toLocaleString()} contributions in the last year`
            : "Contribution activity"}
        </p>
        <a
          href={GITHUB.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group shrink-0 ${cardLinkClass}`}
        >
          [ PROFILE ]
        </a>
      </div>
    </CardSurface>
  )
}
