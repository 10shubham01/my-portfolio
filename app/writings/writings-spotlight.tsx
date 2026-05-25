"use client";

import Link from "next/link";
import { getDevUtilHref, type DevUtil } from "@/lib/dev-utils-data";
import type { WritingPreview } from "@/lib/writings";
import { WorkProjectHeading } from "../work/work-project-heading";
import { UtilCodePreview } from "./util-code-preview";
import { WritingThumbnail } from "./writing-thumbnail";

type SpotlightMode = "writing" | "util";

type WritingsSpotlightProps = {
  writings: WritingPreview[];
  utils: DevUtil[];
  writingIndex: number;
  utilIndex: number;
  mode: SpotlightMode;
};

export function WritingsSpotlight({
  writings,
  utils,
  writingIndex,
  utilIndex,
  mode,
}: WritingsSpotlightProps) {
  if (writings.length === 0 && utils.length === 0) return null;

  const safeWritingIndex = writings.length === 0 ? 0 : Math.max(0, Math.min(writingIndex, writings.length - 1));
  const safeUtilIndex = utils.length === 0 ? 0 : Math.max(0, Math.min(utilIndex, utils.length - 1));
  const currentWriting = writings[safeWritingIndex];
  const currentUtil = utils[safeUtilIndex];
  const showUtil = mode === "util" && currentUtil;
  const showWriting = mode === "writing" && currentWriting;
  const hasSpotlight = showUtil || showWriting;
  const headingLabel = showUtil
    ? currentUtil.title
    : showWriting
      ? currentWriting.title
      : null;
  const headingActiveIndex = showUtil ? writings.length + safeUtilIndex : safeWritingIndex;

  const spotlightGridClassName =
    "mx-auto grid h-full w-full max-w-3xl grid-cols-[minmax(0,8.25rem)_minmax(0,1fr)] items-end gap-3 px-4 pb-4 sm:grid-cols-[minmax(0,11rem)_1fr] sm:px-6 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-4 md:pb-5";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[90]"
      style={{
        top: "var(--site-nav-h, 0px)",
        height: "max(0px, calc(var(--about-fixed-line-top, 20dvh) - var(--site-nav-h, 0px)))",
      }}
    >
      <div className="absolute inset-0 z-[100]">
        <div className={spotlightGridClassName}>
          <div className="pointer-events-auto relative z-10 block">
            {showUtil ? (
              <Link href={getDevUtilHref(currentUtil.id)} aria-label={`Open ${currentUtil.title} source`}>
                <UtilCodePreview
                  title={currentUtil.title}
                  language={currentUtil.language}
                  preview={currentUtil.preview}
                  activeIndex={safeUtilIndex}
                />
              </Link>
            ) : showWriting ? (
              <Link href={currentWriting.href} aria-label={`Open ${currentWriting.title}`}>
                <WritingThumbnail
                  title={currentWriting.title}
                  thumbnail={currentWriting.thumbnail}
                  index={safeWritingIndex}
                  viewTransitionName="writing-thumbnail"
                />
              </Link>
            ) : (
              <div className="w-full max-w-[12rem] self-end md:max-w-[13rem]" aria-hidden />
            )}
          </div>
          <div aria-hidden />
        </div>
      </div>

      <div className="absolute inset-0 z-[90]">
        <div className={spotlightGridClassName}>
          <div aria-hidden />
          {hasSpotlight && headingLabel ? (
            <WorkProjectHeading activeIndex={headingActiveIndex} label={headingLabel} wrap />
          ) : (
            <div aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
