"use client"

import { useEffect, useRef } from "react"

export function useFrameResize(onResize?: (width: number, height: number) => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onResize || !ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      onResize(
        box ? box.inlineSize : entry.contentRect.width,
        box ? box.blockSize : entry.contentRect.height
      )
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onResize])

  return ref
}
