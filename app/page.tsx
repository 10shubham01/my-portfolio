import { HeroText } from "@/components/hero-text";
import { CVLogoIcon, Github, Linkedin, Mail } from "@/components/icons";
import { getLocationAgeEyebrow } from "@/lib/birthday";
import { basteleur } from "@/lib/fonts";
import { SOCIAL_LINKS } from "@/lib/social-links";

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin, external: true },
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: Github, external: true },
  { href: SOCIAL_LINKS.email, label: "Email", Icon: Mail, external: true },
  { href: SOCIAL_LINKS.resume, label: "Resume", Icon: CVLogoIcon, external: true },
] as const;

export default function HomePage() {
  return (
    <section className="social-hover-focus mx-auto flex min-h-[68vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-3 text-center sm:px-4">
      <p className="font-sans font-light text-xs uppercase select-none tracking-[0.28em] text-muted-foreground">
        {getLocationAgeEyebrow()}
      </p>
      <div className="hero-title hero-title--lamp relative z-10 w-full max-w-[min(100%,36rem)] overflow-visible selection:bg-[#FF5800] selection:text-white">
        <HeroText
          text="Yo, I'm Shubham and I build web experiences."
          className={`${basteleur.className} text-3xl font-bold uppercase leading-[1.12] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-5xl md:leading-[1.05] lg:text-6xl`}
        />
      </div>
      <div className="social-links font-sans font-light flex max-w-md flex-wrap items-center justify-center gap-3 text-muted-foreground md:gap-5">
        {SOCIAL_ITEMS.map(({ href, label, Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={label}
            className={`${basteleur.className} inline-flex origin-center cursor-pointer items-center gap-0.5 rounded-sm text-xl font-bold transition-transform duration-300 ease-out hover:scale-[1.5] focus-visible:scale-[1.5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
          >
            <span aria-hidden="true">[</span>
            <Icon className="size-5 shrink-0" aria-hidden />
            <span aria-hidden="true">]</span>
          </a>
        ))}
      </div>
    </section>
  );
}
