"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AlienText } from "@/components/alien-text";
import { cn } from "@repo/ui/lib/utils";

const DOCK_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writings", label: "Writings" },
] as const;

export function SiteDock() {
  const pathname = usePathname();

  return (
    <div
      data-site-dock="true"
      className="site-dock pointer-events-none fixed inset-x-0 top-[calc(11px+10px)] z-50 flex justify-center px-4 pt-[max(0.5rem,env(safe-area-inset-top))]"
    >
      <ul
        role="navigation"
        aria-label="Site"
        className={cn(
          "dock-bar pointer-events-auto relative flex items-center gap-0.5 overflow-visible rounded-full border border-border/45 px-1 py-0.5",
          "bg-background/82 shadow-sm backdrop-blur-md",
          "dark:border-white/10 dark:bg-background/62",
        )}
      >
        {DOCK_ITEMS.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "dock-item inline-flex rounded-full px-2.5 py-1 text-[11px] font-normal tracking-wide transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5800]/45 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  active
                    ? "bg-foreground/8 text-[#FF5800] dark:bg-white/10"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/6",
                )}
              >
                <AlienText text={label} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
