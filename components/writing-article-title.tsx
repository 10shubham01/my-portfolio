"use client";

import { AlienText } from "@/components/alien-text";
import { cn } from "@/lib/utils";

type WritingArticleTitleProps = {
  title: string;
  className?: string;
  id?: string;
};

export function WritingArticleTitle({ title, className, id }: WritingArticleTitleProps) {
  return (
    <h1
      id={id}
      aria-label={title}
      data-writing-section-heading="true"
      data-writing-section-id="top"
      className={cn(
        "font-display text-4xl leading-[1.05] tracking-normal text-foreground sm:text-5xl",
        className,
      )}
    >
      <AlienText text={title} />
    </h1>
  );
}
