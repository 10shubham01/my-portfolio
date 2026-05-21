/** Sketchy border overlay — pair with tone classes from app/globals.css (rb-*). */
export const ROUGH_BORDER = "rough-border border";

/** Top / right / left edge only (dividers, ruler, blockquote). */
export const ROUGH_BORDER_T = "rough-border-t";
export const ROUGH_BORDER_R = "rough-border-r";
export const ROUGH_BORDER_L = "rough-border-l";

export const ROUGH_ROW_IDLE = "rb-transparent rb-row-idle";
export const ROUGH_ROW_ACTIVE = "rb-row-active";

/** Cards, figures, inputs — border-border/55 · dark white/8 */
export const ROUGH_MEDIA = `${ROUGH_BORDER} rb-border-55 dark:rb-white-8`;

/** Horizontal rules & table rows */
export const ROUGH_DIVIDER_T = `${ROUGH_BORDER_T} rb-border-55 dark:rb-white-8`;
