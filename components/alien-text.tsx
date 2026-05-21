"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
};

function HoverableLetter({ letter, index, className }: HoverableLetterProps) {
  const [display, setDisplay] = useState(letter);
  const [initialDone, setInitialDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hoverIntervalRef = useRef<number | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isInView || initialDone) return;

    let scrambleInterval: number | undefined;
    let settleTimeout: number | undefined;

    const startTimeout = window.setTimeout(() => {
      scrambleInterval = window.setInterval(() => {
        setDisplay(randomKatakana());
      }, SCRAMBLE_TICK_MS);

      settleTimeout = window.setTimeout(() => {
        if (scrambleInterval) clearInterval(scrambleInterval);
        setDisplay(letter);
        setInitialDone(true);
      }, SCRAMBLE_DURATION_MS);
    }, index * LETTER_STAGGER_MS);

    return () => {
      clearTimeout(startTimeout);
      if (scrambleInterval) clearInterval(scrambleInterval);
      if (settleTimeout) clearTimeout(settleTimeout);
    };
  }, [isInView, initialDone, index, letter]);

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

export type AlienTextProps = {
  text: string;
  className?: string;
};

export function AlienText({ text, className }: AlienTextProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (reducedMotion || !mounted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-flex gap-px", className)} aria-hidden>
      {text.split("").map((letter, index) => (
        <HoverableLetter key={`${letter}-${index}`} letter={letter} index={index} />
      ))}
    </span>
  );
}

/** @deprecated Use AlienText */
export const DockAlienText = AlienText;
