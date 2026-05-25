/** Shared per-letter timing for hero rise and home-page alien scramble. */
export function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const HERO_Y_DELAY_MAX_S = 0.12;
export const HERO_Y_DURATION_MIN_S = 1.4;
export const HERO_Y_DURATION_RANGE_S = 1.2;

export const HERO_SCRAMBLE_TICK_MS = 35;

export function getHeroLetterTiming(index: number) {
  return {
    delayMs: seeded(index, 1) * HERO_Y_DELAY_MAX_S * 1000,
    durationMs:
      (HERO_Y_DURATION_MIN_S + seeded(index, 2) * HERO_Y_DURATION_RANGE_S) * 1000,
  };
}
