let clickAudio: HTMLAudioElement | null = null

export function playClickSound() {
  if (typeof window === "undefined") return

  if (!clickAudio) {
    clickAudio = new Audio("/click.mp3")
  }

  clickAudio.currentTime = 0
  void clickAudio.play().catch(() => {})
}
