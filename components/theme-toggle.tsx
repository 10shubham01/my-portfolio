"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaPalette, FaRocket, FaHeart } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

type Theme = 'default' | 'ocean' | 'sunset' | 'forest' | 'neon';

const themes: Record<Theme, { name: string; icon: React.ReactNode; primary: string }> = {
  default: {
    name: "Default",
    icon: <FaPalette className="text-blue-500" />,
    primary: "from-blue-500 to-purple-500"
  },
  ocean: {
    name: "Ocean",
    icon: <FaRocket className="text-cyan-500" />,
    primary: "from-cyan-500 to-blue-500"
  },
  sunset: {
    name: "Sunset",
    icon: <FaSun className="text-orange-500" />,
    primary: "from-orange-500 to-pink-500"
  },
  forest: {
    name: "Forest",
    icon: <FaHeart className="text-green-500" />,
    primary: "from-green-500 to-emerald-500"
  },
  neon: {
    name: "Neon",
    icon: <FaPalette className="text-purple-500" />,
    primary: "from-purple-500 to-pink-500"
  }
};

const ThemeToggle = () => {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show theme toggle after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsOpen(false);
    
    // Add a subtle animation effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="relative"
      >
        {/* Main Theme Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 shadow-lg hover:bg-gray-800 transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="text-xl">
            {themes[currentTheme].icon}
          </div>
        </motion.button>

        {/* Theme Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-gray-700 min-w-[200px]"
            >
              <div className="text-sm font-semibold text-gray-300 mb-3 text-center">
                Choose Theme
              </div>
              
              <div className="space-y-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleThemeChange(key as Theme)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      currentTheme === key
                        ? `bg-gradient-to-r ${theme.primary} text-white`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg">
                      {theme.icon}
                    </div>
                    <span className="font-medium">{theme.name}</span>
                    {currentTheme === key && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Theme Preview */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-2 text-center">
                  Preview
                </div>
                <div className="flex gap-2 justify-center">
                  <motion.div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${themes[currentTheme].primary}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${themes[currentTheme].primary}`}
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${themes[currentTheme].primary}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Indicator */}
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${themes[currentTheme].primary}`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default ThemeToggle; 