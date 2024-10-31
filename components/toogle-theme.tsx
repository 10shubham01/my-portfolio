"use client";

import * as React from "react";
import { GiKenkuHead } from "react-icons/gi";
import { useTheme } from "next-themes";

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
      <div onClick={toogleTheme}>
        <GiKenkuHead className="sm:size-20 size-20 rotate-0  transition-all text-black dark:text-white" />
        {/* <MoonIcon className="sm:size-20 size-8 rotate-90 scale-100 transition-all dark:scale-0 text-purple-500" /> */}
      </div>
    </>
  );
}
