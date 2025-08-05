"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = 'default' | 'ocean' | 'sunset' | 'forest' | 'neon';

interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
}

const themes: Record<Theme, ThemeConfig> = {
  default: {
    name: "Default",
    primary: "from-blue-500 to-purple-500",
    secondary: "from-gray-900 via-blue-900 to-purple-900",
    accent: "blue",
    background: "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900",
    textPrimary: "text-blue-400",
    textSecondary: "text-gray-300"
  },
  ocean: {
    name: "Ocean",
    primary: "from-cyan-500 to-blue-500",
    secondary: "from-gray-900 via-cyan-900 to-blue-900",
    accent: "cyan",
    background: "bg-gradient-to-br from-gray-900 via-cyan-900 to-blue-900",
    textPrimary: "text-cyan-400",
    textSecondary: "text-gray-300"
  },
  sunset: {
    name: "Sunset",
    primary: "from-orange-500 to-pink-500",
    secondary: "from-gray-900 via-orange-900 to-pink-900",
    accent: "orange",
    background: "bg-gradient-to-br from-gray-900 via-orange-900 to-pink-900",
    textPrimary: "text-orange-400",
    textSecondary: "text-gray-300"
  },
  forest: {
    name: "Forest",
    primary: "from-green-500 to-emerald-500",
    secondary: "from-gray-900 via-green-900 to-emerald-900",
    accent: "green",
    background: "bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900",
    textPrimary: "text-green-400",
    textSecondary: "text-gray-300"
  },
  neon: {
    name: "Neon",
    primary: "from-purple-500 to-pink-500",
    secondary: "from-gray-900 via-purple-900 to-pink-900",
    accent: "purple",
    background: "bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900",
    textPrimary: "text-purple-400",
    textSecondary: "text-gray-300"
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document body
    const theme = themes[currentTheme];
    document.body.className = theme.background;
    
    // Store theme preference in localStorage
    localStorage.setItem('portfolio-theme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
    themeConfig: themes[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 