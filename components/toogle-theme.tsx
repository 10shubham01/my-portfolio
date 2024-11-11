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
      className="flex items-center justify-center p-2 bg-transparent shadow-inner dark:shadow-gray-800 text-gray-800  dark:text-gray-200 rounded-full transition-all duration-1000 ease-in-out transform hover:scale-110"
    >
      <RxSun
        className={`size-4 transition-all duration-1000 transform ${
          theme === "dark"
            ? "opacity-0 translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
      />
      <RxMoon
        className={`size-4 transition-all duration-1000 transform ${
          theme === "dark"
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        }`}
      />
    </button>
  );
}
