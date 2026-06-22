"use client"

export function TaglineChar({ char }: { char: string }) {
  return (
    <div className="flex h-full w-full select-none items-center justify-center">
      <span
        className="font-display leading-none text-gray-900 dark:text-neutral-100"
        style={{ fontSize: "84px", fontWeight: 700 }}
      >
        {char}
      </span>
    </div>
  )
}
