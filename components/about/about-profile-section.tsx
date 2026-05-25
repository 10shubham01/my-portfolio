import { ABOUT_HELLO } from "@/lib/about-content";
import { getLocationAgeEyebrow } from "@/lib/birthday";
import { basteleur } from "@/lib/fonts";

export function AboutProfileSection() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 text-center sm:gap-4">
      <p className="font-sans text-[11px] font-light uppercase tracking-[0.26em] text-muted-foreground/75 sm:text-xs">
        {getLocationAgeEyebrow()}
      </p>

      <h2
        className={`${basteleur.className} w-full max-w-[min(100%,32rem)] text-[clamp(1.65rem,6vw,2.5rem)] font-bold uppercase leading-[1.1] tracking-tight text-foreground`}
      >
        {ABOUT_HELLO.headline}
      </h2>

      <p className="max-w-lg font-sans text-base font-bold leading-relaxed text-foreground/90 md:text-lg md:leading-[1.65]">
        {ABOUT_HELLO.summary}
      </p>

      <p className="max-w-lg font-sans text-sm font-bold leading-relaxed text-foreground/75 md:text-base md:leading-[1.6]">
        {ABOUT_HELLO.background}
      </p>
    </div>
  );
}
