"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@repo/ui/lib/utils";

/** Peak activity — lower levels are lighter tints of the same hue. */
const ACCENT = "#FF5800";

const LEVEL_BG: Record<
  "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE",
  string
> = {
  NONE: "transparent",
  FIRST_QUARTILE: "#FFE8DC",
  SECOND_QUARTILE: "#FFC299",
  THIRD_QUARTILE: "#FF8F40",
  FOURTH_QUARTILE: ACCENT,
};

interface ContributionDay {
  color: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface GithubContributionData {
  contributions: ContributionDay[][];
  totalContributions: number;
}

export interface GithubCalendarProps {
  username: string;
  variant?: "default" | "city-lights" | "minimal";
  shape?: "square" | "rounded" | "circle" | "squircle";
  /** Wobbly, hand-drawn cell edges (uses site-rough-block filter). */
  roughBlocks?: boolean;
  glowIntensity?: number;
  className?: string;
  showTotal?: boolean;
  colorSchema?: "green" | "blue" | "purple" | "orange" | "gray";
}

function formatContributionTooltip(date: string, count: number): string {
  const parsed = new Date(`${date}T12:00:00`);
  const label = Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  if (count === 0) return `No contributions on ${label}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${label}`;
}

type ContributionTooltipState = {
  date: string;
  count: number;
  x: number;
  y: number;
};

/** Stable per-date jitter so cells look sketched, not grid-perfect. */
function cellJitter(date: string): React.CSSProperties {
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash * 31 + date.charCodeAt(i)) | 0;
  const rot = ((hash % 23) - 11) * 0.75;
  const scale = 0.88 + (Math.abs(hash >> 3) % 11) * 0.014;
  const dx = ((hash >> 5) % 7) - 3;
  const dy = ((hash >> 8) % 7) - 3;
  return {
    transform: `translate(${dx * 0.12}px, ${dy * 0.12}px) rotate(${rot}deg) scale(${scale})`,
  };
}

/** GitHub returns ~53 week columns for the last year. */
const CONTRIBUTION_WEEK_COUNT = 53;

/** Column-major grid: 7 rows × N weeks, columns share width equally. */
const calendarGridClass =
  "grid w-full min-w-0 max-w-full grid-flow-col grid-rows-[repeat(7,auto)] gap-0.5 pb-1 [grid-auto-columns:minmax(0,1fr)] sm:gap-1 md:gap-1.5";

const calendarCellHitClass = "relative aspect-square w-full min-w-0 cursor-default";
const calendarCellVisualClass = "absolute inset-0 size-full min-w-0";

function getShapeClass(shape: string) {
  switch (shape) {
    case "circle":
      return "rounded-full";
    case "square":
      return "rounded-none";
    case "squircle":
      return "rounded-sm";
    case "rounded":
    default:
      return "rounded-[2px]";
  }
}

function cellBackground(
  level: ContributionDay["contributionLevel"],
  colorSchema: GithubCalendarProps["colorSchema"],
): { className?: string; style?: React.CSSProperties } {
  if (colorSchema === "orange") {
    if (level === "NONE") {
      return { className: "bg-zinc-100 dark:bg-zinc-900/80" };
    }
    return { style: { backgroundColor: LEVEL_BG[level] } };
  }
  return { className: legacyLevelClass(level, colorSchema ?? "gray") };
}

/** Preset schemas when not using brand orange. */
function legacyLevelClass(
  level: ContributionDay["contributionLevel"],
  schema: NonNullable<GithubCalendarProps["colorSchema"]>,
): string {
  const schemas = {
    gray: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-zinc-300 dark:bg-zinc-800",
      SECOND_QUARTILE: "bg-zinc-400 dark:bg-zinc-700",
      THIRD_QUARTILE: "bg-zinc-600 dark:bg-zinc-500",
      FOURTH_QUARTILE: "bg-zinc-800 dark:bg-zinc-300",
    },
    green: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-emerald-200 dark:bg-emerald-900",
      SECOND_QUARTILE: "bg-emerald-300 dark:bg-emerald-700",
      THIRD_QUARTILE: "bg-emerald-400 dark:bg-emerald-500",
      FOURTH_QUARTILE: "bg-emerald-500 dark:bg-emerald-400",
    },
    blue: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-blue-200 dark:bg-blue-900",
      SECOND_QUARTILE: "bg-blue-300 dark:bg-blue-700",
      THIRD_QUARTILE: "bg-blue-400 dark:bg-blue-500",
      FOURTH_QUARTILE: "bg-blue-500 dark:bg-blue-400",
    },
    purple: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-purple-200 dark:bg-purple-900",
      SECOND_QUARTILE: "bg-purple-300 dark:bg-purple-700",
      THIRD_QUARTILE: "bg-purple-400 dark:bg-purple-500",
      FOURTH_QUARTILE: "bg-purple-500 dark:bg-purple-400",
    },
    orange: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-orange-200 dark:bg-orange-900",
      SECOND_QUARTILE: "bg-orange-300 dark:bg-orange-700",
      THIRD_QUARTILE: "bg-orange-400 dark:bg-orange-500",
      FOURTH_QUARTILE: "bg-orange-500 dark:bg-orange-400",
    },
  } as const;
  return schemas[schema][level];
}

export function GithubCalendar({
  username,
  variant = "default",
  shape = "rounded",
  roughBlocks = true,
  glowIntensity = 5,
  className,
  showTotal = true,
  colorSchema = "orange",
}: GithubCalendarProps) {
  const [data, setData] = React.useState<GithubContributionData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<ContributionTooltipState | null>(null);

  const showTooltip = React.useCallback(
    (event: React.SyntheticEvent<HTMLDivElement>, day: ContributionDay) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        date: day.date,
        count: day.contributionCount,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [],
  );

  const hideTooltip = React.useCallback(() => setTooltip(null), []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }
        const jsonData = (await response.json()) as GithubContributionData;
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      void fetchData();
    }
  }, [username]);

  if (error) {
    return (
      <p className="text-center text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          calendarGridClass,
          roughBlocks && "gap-1 sm:gap-1.5 md:gap-2",
          className,
        )}
        aria-busy
        aria-label="Loading contribution calendar"
      >
        {Array.from({ length: CONTRIBUTION_WEEK_COUNT * 7 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              calendarCellHitClass,
              roughBlocks ? "github-calendar-cell--rough rounded-[1px]" : "rounded-[2px]",
              "bg-muted",
            )}
          />
        ))}
      </div>
    );
  }

  const weeks = data?.contributions ?? [];
  const useBrandOrange = colorSchema === "orange";
  const shapeClass = roughBlocks ? "rounded-[1px]" : getShapeClass(shape);

  return (
    <div className={cn("flex w-full min-w-0 max-w-full flex-col gap-3", className)}>
      {showTotal && (
        <p className="wrap-break-word text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">@{username}</span> — {data?.totalContributions ?? 0}{" "}
          contributions in the last year
        </p>
      )}

      <div
        className={cn(
          calendarGridClass,
          roughBlocks && "gap-1 sm:gap-1.5 md:gap-2",
        )}
      >
        {weeks.flatMap((week) =>
          week.map((day) => {
            const isGlowing = variant === "city-lights" && day.contributionCount > 0;
            const isMinimal = variant === "minimal";
            const bg = cellBackground(day.contributionLevel, colorSchema);

            const tooltipLabel = formatContributionTooltip(day.date, day.contributionCount);

            return (
              <div
                key={day.date}
                className={calendarCellHitClass}
                title={tooltipLabel}
                aria-label={tooltipLabel}
                onMouseEnter={(event) => showTooltip(event, day)}
                onMouseLeave={hideTooltip}
                onFocus={(event) => showTooltip(event, day)}
                onBlur={hideTooltip}
              >
                <div
                  className={cn(
                    calendarCellVisualClass,
                    bg.className,
                    shapeClass,
                    roughBlocks && "github-calendar-cell--rough",
                    isMinimal && !roughBlocks && "scale-75 rounded-full",
                    isGlowing && "z-10",
                  )}
                  style={{
                    ...bg.style,
                    ...(roughBlocks ? cellJitter(day.date) : undefined),
                    ...(isGlowing && day.contributionLevel !== "NONE"
                      ? {
                          boxShadow: `0 0 ${
                            day.contributionCount > 3 ? glowIntensity * 1.5 : glowIntensity
                          }px ${useBrandOrange ? ACCENT : "#f97316"}`,
                        }
                      : undefined),
                  }}
                />
              </div>
            );
          }),
        )}
      </div>

      {tooltip && typeof document !== "undefined"
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-[200] max-w-[16rem] -translate-x-1/2 -translate-y-[calc(100%+6px)] rounded-md border border-border/70 bg-background/98 px-2.5 py-1.5 text-center text-xs font-medium text-foreground shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-sm dark:border-white/12 dark:bg-[#171717]/98"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {formatContributionTooltip(tooltip.date, tooltip.count)}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
