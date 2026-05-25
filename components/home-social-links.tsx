"use client";

import { AlienText } from "@/components/alien-text";
import { CVLogoIcon, Github, Instagram, Linkedin, PeerlistSolid } from "@/components/icons";
import { basteleur } from "@/lib/fonts";
import { SOCIAL_LINKS } from "@/lib/social-links";
import type { ComponentType, SVGProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin, external: true },
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: Github, external: true },
  { href: SOCIAL_LINKS.peerlist, label: "Peerlist", Icon: PeerlistSolid, external: true },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: Instagram, external: true },
  { href: SOCIAL_LINKS.resume, label: "Resume", Icon: CVLogoIcon, external: true },
  { href: SOCIAL_LINKS.email, label: "Get in touch", text: "GET IN TOUCH", external: true },
] as const satisfies ReadonlyArray<
  | { href: string; label: string; Icon: SocialIcon; external: boolean }
  | { href: string; label: string; text: string; external: boolean }
>;

const ENTER_DEBOUNCE_MS = 80;
const LEAVE_DEBOUNCE_MS = 120;

export function HomeSocialLinks() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isKeyboardFocusRef = useRef(false);

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const commitActiveLabel = useCallback((label: string | null) => {
    setActiveLabel(label);
  }, []);

  const scheduleActiveLabel = useCallback(
    (label: string | null, delayMs: number) => {
      clearDebounceTimer();
      debounceTimerRef.current = setTimeout(() => {
        commitActiveLabel(label);
        debounceTimerRef.current = null;
      }, delayMs);
    },
    [clearDebounceTimer, commitActiveLabel],
  );

  useEffect(() => clearDebounceTimer, [clearDebounceTimer]);

  return (
    <div
      data-social-hover-active={activeLabel !== null}
      className="social-links relative z-20 font-sans font-light flex max-w-md flex-wrap items-center justify-center gap-3 text-muted-foreground md:gap-5"
    >
      {SOCIAL_ITEMS.map((item) => {
        const isActive = activeLabel === item.label;

        return (
          <a
            key={item.label}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={item.label}
            data-social-active={isActive}
            className={`${basteleur.className} inline-flex origin-center cursor-pointer items-center gap-0.5 rounded-sm text-xl font-bold transition-transform duration-300 ease-out hover:scale-[1.5] focus-visible:scale-[1.5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            onMouseEnter={() => {
              isKeyboardFocusRef.current = false;
              scheduleActiveLabel(item.label, ENTER_DEBOUNCE_MS);
            }}
            onMouseLeave={() => {
              if (isKeyboardFocusRef.current) return;
              scheduleActiveLabel(null, LEAVE_DEBOUNCE_MS);
            }}
            onFocus={() => {
              isKeyboardFocusRef.current = true;
              clearDebounceTimer();
              commitActiveLabel(item.label);
            }}
            onBlur={() => {
              isKeyboardFocusRef.current = false;
              scheduleActiveLabel(null, LEAVE_DEBOUNCE_MS);
            }}
          >
            <AlienText text="[" />
            {"text" in item
              ? (
                <AlienText text={item.text} className="shrink-0 text-sm tracking-wide sm:text-base" />
              )
              : <item.Icon className="size-5 shrink-0" aria-hidden />}
            <AlienText text="]" />
          </a>
        );
      })}
    </div>
  );
}
