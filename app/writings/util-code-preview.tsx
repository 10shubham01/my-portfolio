"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ROUGH_BORDER } from "@/lib/rough-border";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type UtilCodePreviewProps = {
  title: string;
  language: string;
  preview: string;
  activeIndex: number;
  className?: string;
};

export function UtilCodePreview({
  title,
  language,
  preview,
  activeIndex,
  className = "",
}: UtilCodePreviewProps) {
  return (
    <div
      className={`${ROUGH_BORDER} dark:rb-white-10 relative aspect-video w-full overflow-hidden rounded-sm bg-[#171717] shadow-[0_10px_40px_rgba(0,0,0,0.32)] [--rough-border-color:oklch(1_0_0/10%)] ${className}`}
    >
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5800]" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.14em] text-white/40 uppercase">
        {language}
      </div>
      <AnimatePresence mode="wait">
        <motion.pre
          key={`${activeIndex}-${title}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="absolute inset-0 overflow-hidden p-3 pt-9 font-mono text-[9px] leading-[1.45] text-white/72 sm:text-[10px]"
        >
          <code className="block whitespace-pre-wrap break-all">{preview.trim()}</code>
        </motion.pre>
      </AnimatePresence>
      <div className="absolute bottom-3 left-3 max-w-[75%] truncate font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">
        {title}
      </div>
    </div>
  );
}
