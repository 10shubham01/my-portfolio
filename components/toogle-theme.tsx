"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RxMoon, RxSun } from "react-icons/rx";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-1 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 rounded-full shadow-lg transition-all duration-1000 ease-in-out transform hover:scale-110"
    >
      <RxSun
        className={`sm:size-3 size-3 transition-all duration-1000 transform ${
          theme === "dark"
            ? "opacity-0 translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
      />
      <RxMoon
        className={`sm:size-3 size-3 transition-all duration-1000 transform ${
          theme === "dark"
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        }`}
      />
    </button>
  );
}
