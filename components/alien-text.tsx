"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  getHeroLetterTiming,
  HERO_SCRAMBLE_TICK_MS,
} from "@/lib/hero-text-timing";
import { usePrefersLightMotion } from "@/lib/motion-capability";
import { cn } from "@/lib/utils";

const KATAKANA = [
  "ア",
  "イ",
  "ウ",
  "エ",
  "オ",
  "カ",
  "キ",
  "ク",
  "ケ",
  "コ",
  "サ",
  "シ",
  "ス",
  "セ",
  "ソ",
  "タ",
  "チ",
  "ツ",
  "テ",
  "ト",
  "ナ",
  "ニ",
  "ヌ",
  "ネ",
  "ノ",
  "ハ",
  "ヒ",
  "フ",
  "ヘ",
  "ホ",
  "マ",
  "ミ",
  "ム",
  "メ",
  "モ",
  "ヤ",
  "ユ",
  "ヨ",
  "ー",
  "ラ",
  "リ",
  "ル",
  "レ",
  "ロ",
  "ワ",
  "ヰ",
  "ヱ",
  "ヲ",
  "ン",
  "ガ",
  "ギ",
  "グ",
  "ゲ",
  "ゴ",
  "ザ",
  "ジ",
  "ズ",
  "ゼ",
  "ゾ",
  "ダ",
  "ヂ",
  "ヅ",
  "デ",
  "ド",
  "バ",
  "ビ",
  "ブ",
  "ベ",
  "ボ",
  "パ",
  "ピ",
  "プ",
  "ペ",
  "ポ",
] as const;

function randomKatakana() {
  return KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
}

const SCRAMBLE_TICK_MS = 35;
const SCRAMBLE_DURATION_MS = 650;
const LETTER_STAGGER_MS = 90;

type HoverableLetterProps = {
  letter: string;
  index: number;
  className?: string;
  syncHeroTiming?: boolean;
  heroPlay?: boolean;
};

function HoverableLetter({
  letter,
  index,
  className,
  syncHeroTiming = false,
  heroPlay = false,
}: HoverableLetterProps) {
  const [display, setDisplay] = useState(letter);
  const [initialDone, setInitialDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hoverIntervalRef = useRef<number | null>(null);
  const isInView = useInView(ref, { once: true });
  const shouldAnimate = syncHeroTiming ? heroPlay : isInView;
  const { delayMs, durationMs } = syncHeroTiming
    ? getHeroLetterTiming(index)
    : { delayMs: index * LETTER_STAGGER_MS, durationMs: SCRAMBLE_DURATION_MS };
  const scrambleTickMs = syncHeroTiming ? HERO_SCRAMBLE_TICK_MS : SCRAMBLE_TICK_MS;

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!shouldAnimate || initialDone) return;

    let scrambleInterval: number | undefined;
    let settleTimeout: number | undefined;

    const startTimeout = window.setTimeout(() => {
      scrambleInterval = window.setInterval(() => {
        setDisplay(randomKatakana());
      }, scrambleTickMs);

      settleTimeout = window.setTimeout(() => {
        if (scrambleInterval) clearInterval(scrambleInterval);
        setDisplay(letter);
        setInitialDone(true);
      }, durationMs);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      if (scrambleInterval) clearInterval(scrambleInterval);
      if (settleTimeout) clearTimeout(settleTimeout);
    };
  }, [shouldAnimate, initialDone, letter, delayMs, durationMs, scrambleTickMs]);

  const handleMouseEnter = () => {
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    hoverIntervalRef.current = window.setInterval(() => {
      setDisplay(randomKatakana());
    }, SCRAMBLE_TICK_MS);
  };

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setDisplay(letter);
  };

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {display === " " ? "\u00A0" : display}
    </span>
  );
}

type AlienWordGroupProps = {
  word: string;
  wordIndex: number;
  syncHeroTiming?: boolean;
  heroPlay?: boolean;
  indexOffset?: number;
};

function AlienWordGroup({
  word,
  wordIndex,
  syncHeroTiming,
  heroPlay,
  indexOffset = 0,
}: AlienWordGroupProps) {
  const baseIndex = indexOffset + wordIndex * 48;

  return (
    <span className="inline-flex gap-px">
      {word.split("").map((letter, index) => (
        <HoverableLetter
          key={`${wordIndex}-${index}-${letter}`}
          letter={letter}
          index={baseIndex + index}
          syncHeroTiming={syncHeroTiming}
          heroPlay={heroPlay}
        />
      ))}
    </span>
  );
}

export type AlienTextProps = {
  text: string;
  className?: string;
  /** Break at word boundaries so long headings wrap instead of overflowing. */
  wrap?: boolean;
  /** Match hero rise delays/durations (home page only). */
  syncHeroTiming?: boolean;
  /** Global char index offset when multiple AlienText blocks share hero timing. */
  indexOffset?: number;
};

export function AlienText({
  text,
  className,
  wrap = false,
  syncHeroTiming = false,
  indexOffset = 0,
}: AlienTextProps) {
  const reducedMotion = useReducedMotion();
  const lightMotion = usePrefersLightMotion();
  const [mounted, setMounted] = useState(false);
  const [heroPlay, setHeroPlay] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!syncHeroTiming || !mounted) return;

    const frame = requestAnimationFrame(() => setHeroPlay(true));
    return () => cancelAnimationFrame(frame);
  }, [syncHeroTiming, mounted]);

  if (reducedMotion || lightMotion || !mounted) {
    return <span className={cn(wrap && "break-words", className)}>{text}</span>;
  }

  if (wrap) {
    const words = text.split(/\s+/).filter(Boolean);

    return (
      <span
        className={cn("flex max-w-full flex-wrap items-baseline gap-x-[0.35em] gap-y-1", className)}
        aria-hidden
      >
        {words.map((word, wordIndex) => (
          <AlienWordGroup
            key={`${word}-${wordIndex}`}
            word={word}
            wordIndex={wordIndex}
            syncHeroTiming={syncHeroTiming}
            heroPlay={heroPlay}
            indexOffset={indexOffset}
          />
        ))}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex gap-px", className)} aria-hidden>
      {text.split("").map((letter, index) => (
        <HoverableLetter
          key={`${letter}-${index}`}
          letter={letter}
          index={indexOffset + index}
          syncHeroTiming={syncHeroTiming}
          heroPlay={heroPlay}
        />
      ))}
    </span>
  );
}

/** @deprecated Use AlienText */
export const DockAlienText = AlienText;
