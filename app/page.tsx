import { PortfolioCanvas } from "@/components/portfolio/portfolio-canvas"
import { ThemeProvider } from "@/components/portfolio/theme-provider"

export default function Page() {
  return (
    <ThemeProvider>
      <PortfolioCanvas />
    </ThemeProvider>
  )
}
