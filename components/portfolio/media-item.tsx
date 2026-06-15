"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { CanvasItem } from "@/lib/canvas-config"

export function MediaItem({
  item,
  active,
  onResize,
}: {
  item: CanvasItem
  active: boolean
  onResize?: (width: number, height: number) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isVideo = item.type === "video"
  const isGif = item.type === "image" && item.src?.endsWith(".gif")
  const showImagePreview = item.src && (!isVideo || item.thumbnail)

  const captureVideoSnapshot = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const snapshot = canvas.toDataURL()
    video.parentElement?.style.setProperty("--video-snapshot", `url(${snapshot})`)
  }

  useEffect(() => {
    if (!isVideo || !videoRef.current) return

    if (active) {
      videoRef.current.play().catch(() => {
        console.warn("Video autoplay failed")
      })
    } else {
      videoRef.current.pause()
      captureVideoSnapshot()
    }
  }, [active, isVideo, item.id])

  if (item.type === "intro") return null

  if (item.type === "placeholder") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #d1d5db",
        }}
        className="dark:border-neutral-600 dark:bg-neutral-800"
      >
        <span style={{ color: "#9ca3af", fontSize: 10, fontFamily: "monospace" }}>
          PLACEHOLDER
        </span>
      </div>
    )
  }

  const handleImageLoad = (target: HTMLImageElement) => {
    setLoaded(true)

    if (isGif) {
      const canvas = document.createElement("canvas")
      canvas.width = target.naturalWidth
      canvas.height = target.naturalHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(target, 0, 0)
        const snapshot = canvas.toDataURL()
        target.parentElement?.style.setProperty("--snapshot", `url(${snapshot})`)
      }
    }

    if (onResize && target.naturalWidth && target.naturalHeight) {
      const ratio = target.naturalWidth / target.naturalHeight
      onResize(item.width, item.width / ratio)
    }
  }

  const handleVideoMetadata = (video: HTMLVideoElement) => {
    if (video.readyState >= 2) {
      captureVideoSnapshot()
      setLoaded(true)
    } else {
      video.addEventListener(
        "loadeddata",
        () => {
          captureVideoSnapshot()
          setLoaded(true)
        },
        { once: true }
      )
    }

    if (onResize && video.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight
      onResize(item.width, item.width / ratio)
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: item.placeholderColor || "transparent",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        pointerEvents: "none",
      }}
    >
      {showImagePreview && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: active && isVideo ? (playing ? 0 : 1) : 1,
            transition: "opacity 0.5s ease",
            zIndex: 1,
          }}
        >
          <Image
            src={isVideo && item.thumbnail ? item.thumbnail : item.src!}
            alt={isVideo ? "Video thumbnail" : item.alt || item.label}
            fill
            crossOrigin="anonymous"
            unoptimized={isGif}
            sizes={`${item.width}px`}
            style={{
              objectFit: "cover",
              opacity: isGif && !active ? 0 : 1,
            }}
            onLoad={(event) => handleImageLoad(event.currentTarget)}
            draggable={false}
          />
          {isGif && !active && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "var(--snapshot)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 2,
              }}
            />
          )}
        </div>
      )}

      {isVideo && item.src && (
        <>
          <video
            ref={videoRef}
            src={item.src}
            loop
            muted
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onLoadedMetadata={(event) => handleVideoMetadata(event.currentTarget)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
              zIndex: 2,
              opacity: active ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            draggable={false}
          />
          {!active && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "var(--video-snapshot)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 3,
                backgroundColor: item.placeholderColor || "#000",
                transition: "opacity 0.4s ease",
              }}
            />
          )}
        </>
      )}

      {!loaded && !isVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: item.placeholderColor || "#171717",
          }}
        />
      )}
    </div>
  )
}
