import Image from "next/image";

import { cn } from "@/lib/utils";

const WAVY_DOODLES_WAVING = "/images/wavy-doodles/waving.gif";
const WAVY_DOODLES_ASPECT = 269 / 200;

type WavyDoodlesProps = {
  className?: string;
  /** Render width in CSS pixels; height follows sprite aspect ratio. */
  size?: number;
};

/** Wavy Doodles — pixel TV mascot (animated wave). */
export function WavyDoodles({ className, size = 64 }: WavyDoodlesProps) {
  const height = Math.round(size * WAVY_DOODLES_ASPECT);

  return (
    <Image
      src={WAVY_DOODLES_WAVING}
      alt=""
      width={size}
      height={height}
      unoptimized
      priority
      title="Wavy Doodles"
      className={cn(
        "block h-auto w-auto invert [image-rendering:pixelated] dark:invert-0",
        className,
      )}
      style={{ width: size, height }}
      aria-hidden
    />
  );
}
