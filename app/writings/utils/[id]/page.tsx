import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { WritingArticleTitle } from "@/components/writing-article-title";
import { DEV_UTILS, DEV_UTILS_REPO, getDevUtilById } from "@/lib/dev-utils";
import { absoluteUrl, SITE_AUTHOR, SITE_NAME, SITE_TWITTER_HANDLE, siteImages } from "@/lib/site";
import { ROUGH_DIVIDER_T } from "@/lib/rough-border";
import { ProgressiveBlur } from "../../[slug]/progressive-blur";
import { WritingMdxContent } from "../../[slug]/writing-mdx-content";
import { UtilCodePreview } from "../../util-code-preview";

export async function generateStaticParams() {
  return DEV_UTILS.map((util) => ({ id: util.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const util = getDevUtilById(id);

    return {
      title: util.title,
      description: util.description,
      alternates: {
        canonical: absoluteUrl(`/writings/utils/${id}`),
      },
      openGraph: {
        type: "article",
        title: util.title,
        description: util.description,
        url: `/writings/utils/${id}`,
        siteName: SITE_NAME,
        authors: [SITE_AUTHOR.name],
        images: [
          {
            url: siteImages.og,
            width: 1200,
            height: 675,
            alt: util.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: util.title,
        description: util.description,
        images: [{ url: siteImages.og, alt: util.title }],
        creator: SITE_TWITTER_HANDLE,
      },
    };
  } catch {
    return {};
  }
}

export default async function UtilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let util;
  try {
    util = getDevUtilById(id);
  } catch {
    notFound();
  }

  const utils = DEV_UTILS;
  const currentIndex = utils.findIndex((entry) => entry.id === id);
  const previousUtil =
    currentIndex >= 0 && utils.length > 1 ? utils[(currentIndex - 1 + utils.length) % utils.length] : null;
  const nextUtil =
    currentIndex >= 0 && utils.length > 1 ? utils[(currentIndex + 1) % utils.length] : null;

  const mdxContent = `\`\`\`${util.codeLanguage}\n${util.code}\n\`\`\``;

  return (
    <>
      <ProgressiveBlur position="top" height="130px" blurAmount="5px" />
      <ProgressiveBlur position="bottom" height="170px" blurAmount="6px" />

      <article
        id="top"
        data-writing-article="true"
        className="relative mx-auto w-full max-w-(--writing-content-width) pb-28 pt-8 sm:pt-10"
      >
        <nav
          className="mb-8 flex items-center justify-between gap-3 text-sm text-muted-foreground"
          aria-label="Util navigation"
        >
          <Link
            href="/writings"
            className="rounded-sm px-0 py-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back
          </Link>
          <Link
            href={util.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm py-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GithubLogoIcon size={16} weight="regular" />
            View on GitHub
            <ArrowSquareOutIcon size={14} weight="regular" className="opacity-60" />
          </Link>
        </nav>

        <header>
          <UtilCodePreview
            title={util.title}
            language={util.language}
            preview={util.preview}
            activeIndex={currentIndex}
            className="rounded-md"
          />

          <div className="mt-7 flex min-w-0 flex-col gap-3">
            <p className="font-mono text-xs font-medium tracking-[0.12em] text-[#FF5800]/85 uppercase">
              {util.filename} · {util.language}
            </p>
            <WritingArticleTitle title={util.title} />
            <p className="max-w-2xl font-sans text-base leading-7 text-muted-foreground sm:text-lg">
              {util.description}
            </p>
          </div>

          <div className="mt-7 h-px w-full bg-border" aria-hidden />
        </header>

        <WritingMdxContent content={mdxContent} />

        <p className="mt-8 text-sm text-muted-foreground">
          Part of the{" "}
          <Link href="/writings/utils" className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
            utils collection
          </Link>{" "}
          on{" "}
          <Link
            href={DEV_UTILS_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          >
            GitHub
          </Link>
          .
        </p>

        {previousUtil || nextUtil ? (
          <nav
            className={`${ROUGH_DIVIDER_T} rb-border-55 mt-14 grid grid-cols-2 gap-3 pt-5 text-[11px] text-muted-foreground sm:text-sm`}
            aria-label="Adjacent utils"
          >
            {previousUtil ? (
              <Link
                href={`/writings/utils/${previousUtil.id}`}
                className="group min-w-0 rounded-sm text-left transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70 sm:text-xs sm:tracking-[0.12em]">
                  Previous util
                </span>
                <span className="mt-1 block break-words text-[11px] text-foreground/85 group-hover:text-foreground sm:text-sm">
                  {previousUtil.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {nextUtil ? (
              <Link
                href={`/writings/utils/${nextUtil.id}`}
                className="group min-w-0 rounded-sm text-right transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70 sm:text-xs sm:tracking-[0.12em]">
                  Next util
                </span>
                <span className="mt-1 block break-words text-[11px] text-foreground/85 group-hover:text-foreground sm:text-sm">
                  {nextUtil.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>
    </>
  );
}
