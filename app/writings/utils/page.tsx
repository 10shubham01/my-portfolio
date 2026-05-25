import type { Metadata } from "next";
import Link from "next/link";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { DEV_UTILS, DEV_UTILS_REPO } from "@/lib/dev-utils-data";
import { absoluteUrl, SITE_AUTHOR, SITE_NAME, SITE_TWITTER_HANDLE, siteImages } from "@/lib/site";
import { ROUGH_BORDER, ROUGH_ROW_IDLE } from "@/lib/rough-border";

const description = `Dev utilities by ${SITE_AUTHOR.name} — scripts for cleaning assets, converting images, updating meta tags, and video workflows.`;

export const metadata: Metadata = {
  title: "Utils",
  description,
  alternates: {
    canonical: absoluteUrl("/writings/utils"),
  },
  openGraph: {
    title: `Utils by ${SITE_AUTHOR.name}`,
    description,
    url: "/writings/utils",
    siteName: SITE_NAME,
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: `Utils by ${SITE_AUTHOR.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Utils by ${SITE_AUTHOR.name}`,
    description,
    images: [siteImages.og],
    creator: SITE_TWITTER_HANDLE,
  },
};

export default function UtilsIndexPage() {
  return (
    <div className="relative mx-auto w-full max-w-(--writing-content-width) pb-28 pt-8 sm:pt-10">
      <nav className="mb-8 text-sm text-muted-foreground" aria-label="Utils navigation">
        <Link
          href="/writings"
          className="rounded-sm px-0 py-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to writings
        </Link>
      </nav>

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#FF5800]/85 uppercase">Dev utils</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.1] tracking-normal text-foreground sm:text-5xl">
            Utils
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Handy scripts from my{" "}
            <Link
              href={DEV_UTILS_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-foreground/85 underline-offset-4 hover:text-foreground hover:underline"
            >
              utils repo
            </Link>
            . Open any script to read the full source with copy support.
          </p>
        </div>
        <Link
          href={DEV_UTILS_REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-foreground/45 uppercase transition-colors hover:text-foreground/80"
        >
          <GithubLogoIcon size={14} weight="regular" />
          View repo
        </Link>
      </header>

      <ul className="space-y-0.5" aria-label="Utils list">
        {DEV_UTILS.map((util) => (
          <li key={util.id}>
            <Link
              href={`/writings/utils/${util.id}`}
              className={`${ROUGH_BORDER} ${ROUGH_ROW_IDLE} group flex items-center gap-1.5 rounded-xl px-1 py-1.5 text-[16px] leading-6 text-foreground/70 transition-[background-color,color] duration-200 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5`}
            >
              <div className="min-w-0 flex-1 basis-0 pl-2.5">
                <p className="break-words font-medium text-foreground/90 group-hover:text-foreground">{util.title}</p>
                <p className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-foreground/35 uppercase">
                  {util.filename} · {util.language}
                </p>
              </div>
              <span className="h-px min-w-8 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/45 transition-colors group-hover:bg-foreground/8 group-hover:text-foreground/85 dark:group-hover:bg-white/8">
                <ArrowSquareOutIcon size={16} weight="regular" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
