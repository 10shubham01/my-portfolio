"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  getCanvasBg,
  getInitialTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme"

type ThemeContextValue = {
  theme: Theme
  isDark: boolean
  canvasBg: string
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    const initial = getInitialTheme()
    setThemeState(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark"
      localStorage.setItem(THEME_STORAGE_KEY, next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        canvasBg: getCanvasBg(theme),
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
