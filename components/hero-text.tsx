"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const Y_DELAY_MAX = 0.12;
const Y_DURATION_MIN = 1.4;
const Y_DURATION_RANGE = 1.2;
const ROTATE_DELAY_MAX = 0.35;
const ROTATE_DURATION_MIN = 1.8;
const ROTATE_DURATION_RANGE = 1.6;

/** Distance from below the viewport so letters rise into the hero. */
function getDropY() {
  if (typeof window === "undefined") return 900;
  return Math.round(window.innerHeight * 0.82);
}

function HeroWordLayout({
  words,
  className,
  renderChar,
}: {
  words: string[];
  className?: string;
  renderChar: (char: string, index: number, key: string) => ReactNode;
}) {
  let charOffset = 0;

  return (
    <div className={cn("relative flex flex-wrap justify-center font-semibold", className)}>
      {words.map((word, wordIndex) => {
        const wordStartIndex = charOffset;
        charOffset += word.length;

        return (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) =>
              renderChar(char, wordStartIndex + charIndex, `${wordIndex}-${charIndex}`),
            )}
            {wordIndex < words.length - 1 ? (
              <span className="inline-block" aria-hidden>
                {"\u00A0"}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

/** Client-only — motion initial state is never SSR'd. */
function AnimatedHero({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ").filter(Boolean);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [dropY, setDropY] = useState(() => getDropY());
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const syncDrop = () => setDropY(getDropY());
    syncDrop();
    window.addEventListener("resize", syncDrop);

    const frame = requestAnimationFrame(() => setPlay(true));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncDrop);
    };
  }, []);

  let charOffset = 0;

  return (
    <>
      <div
        ref={dragConstraintsRef}
        className="pointer-events-none fixed inset-0"
        aria-hidden
      />
      <div className={cn("relative isolate w-full overflow-visible", className)}>
      <div
        className="relative flex flex-wrap justify-center font-semibold"
        aria-label={text}
      >
        {words.map((word, wordIndex) => {
          const wordStartIndex = charOffset;
          charOffset += word.length;

          return (
            <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => {
                const index = wordStartIndex + charIndex;
                const yDelay = seeded(index, 1) * Y_DELAY_MAX;
                const yDuration = Y_DURATION_MIN + seeded(index, 2) * Y_DURATION_RANGE;
                const rotateDelay = seeded(index, 3) * ROTATE_DELAY_MAX;
                const rotateDuration = ROTATE_DURATION_MIN + seeded(index, 4) * ROTATE_DURATION_RANGE;
                const rotateInitial = Math.round((seeded(index, 5) * 150 - 50) * 100) / 100;

                return (
                  <motion.span
                    key={`${wordIndex}-${charIndex}`}
                    className="z-50 inline-block cursor-grab"
                    initial={{ y: dropY, rotate: rotateInitial }}
                    animate={
                      play ? { y: 0, rotate: 0 } : { y: dropY, rotate: rotateInitial }
                    }
                    transition={{
                      y: {
                        delay: yDelay,
                        duration: yDuration,
                        ease: "easeInOut",
                      },
                      rotate: {
                        delay: rotateDelay,
                        duration: rotateDuration,
                        ease: "easeInOut",
                      },
                    }}
                    drag
                    dragConstraints={dragConstraintsRef}
                    dragElastic={0.08}
                    dragMomentum={false}
                    whileDrag={{ zIndex: 50 }}
                    aria-hidden
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <span className="inline-block" aria-hidden>
                  {"\u00A0"}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <div
        className="hero-text-ghost pointer-events-none absolute inset-0 -z-10 flex flex-wrap justify-center text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255, 88, 0, 0.45)" }}
        aria-hidden
      >
        <HeroWordLayout
          words={words}
          renderChar={(char, _index, key) => (
            <span className="inline-block" key={key}>
              {char}
            </span>
          )}
        />
      </div>
    </div>
    </>
  );
}

function StaticHero({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ").filter(Boolean);

  return (
    <div className={cn("relative overflow-visible", className)} aria-label={text}>
      <HeroWordLayout
        words={words}
        renderChar={(char, _index, key) => (
          <span className="inline-block" key={key}>
            {char}
          </span>
        )}
      />
      <div
        className="hero-text-ghost pointer-events-none absolute inset-0 -z-10 text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255, 88, 0, 0.45)" }}
        aria-hidden
      >
        <HeroWordLayout
          words={words}
          renderChar={(char, _index, key) => (
            <span className="inline-block" key={key}>
              {char}
            </span>
          )}
        />
      </div>
    </div>
  );
}

export function HeroText({ text, className }: { text: string; className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <StaticHero text={text} className={cn(className, "invisible")} />;
  }

  return <AnimatedHero text={text} className={className} />;
}
