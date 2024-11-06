"use client";

import * as React from "react";
import { GiKenkuHead } from "react-icons/gi";
import { useTheme } from "next-themes";
import { Noto_Sans, Stalinist_One, Bungee_Outline } from "next/font/google";
const noto_Sans = Bungee_Outline({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
});
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const toogleTheme = () => {
    if (theme === "dark") {
      return setTheme("light");
    }
    return setTheme("dark");
  };
  return (
    <>
      <div
        onClick={toogleTheme}
        className={`text-7xl sm:text-7xl  font-bold ${noto_Sans.className} bg-gradient-to-r from-indigo-600 via-purple-500 to-transparent inline-block text-transparent bg-clip-text my-3 `}
      >
        {/* <GiKenkuHead className="sm:size-20 size-20 rotate-0  transition-all text-black dark:text-white" /> */}
        {"</>"}
        {/* <MoonIcon className="sm:size-20 size-8 rotate-90 scale-100 transition-all dark:scale-0 text-purple-500" /> */}
      </div>
    </>
  );
}
