"use client";
import React, { useEffect, useState, useRef } from "react";

import { motion } from "framer-motion";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import localFont from "next/font/local";
import Draggable from "react-draggable";
import { Work } from "@/components/work";
import { Bungee_Outline } from "next/font/google";
import { ModeToggle } from "@/components/toogle-theme";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { Skills } from "@/components/skills";
const myFont = localFont({ src: "./fonts/UltraSolar Normal.ttf" });

const noto_Sans = Bungee_Outline({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
});

const text = "Shubham";

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};
export default function BackgroundBeamsWithCollisionDemo() {
  const { theme } = useTheme();
  const [color, setColor] = useState<string>("#ffffff");
  const circleRef = useRef<HTMLDivElement>(null);
  const innerCircle = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null); // New ref for the period

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  useEffect(() => {
    // Set initial position of the circles to match the period
    if (periodRef.current && circleRef.current && innerCircle.current) {
      const rect = periodRef.current.getBoundingClientRect();
      circleRef.current.style.left = `${rect.left - 35}px`;
      circleRef.current.style.top = `${rect.top + 68}px`;
      innerCircle.current.style.left = `${rect.left + 5}px`;
      innerCircle.current.style.top = `${rect.top + 110}px`;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.left = `${e.pageX - 45}px`;
          circleRef.current.style.top = `${e.pageY - 45}px`;
        }
      }, 100);

      if (innerCircle.current) {
        innerCircle.current.style.left = `${e.pageX - 5}px`;
        innerCircle.current.style.top = `${e.pageY - 5}px`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.className =
        "absolute size-8 bg-black dark:bg-white rounded-full opacity-30 animate-[ripple_0.6s_ease-out] pointer-events-none";
      ripple.style.left = `${e.pageX - circleRef.current!.offsetLeft - 16}px`;
      ripple.style.top = `${e.pageY - circleRef.current!.offsetTop - 16}px`;
      circleRef.current!.appendChild(ripple);
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <BackgroundBeamsWithCollision className="relative !cursor-none text-gray-900 dark:text-gray-200">
      <div
        ref={circleRef}
        className="size-24 rounded-full border-[.5px] opacity-50 dark:border-white border-black absolute top-[72px] left-[72px] sm:block hidden"
      ></div>
      <div
        className="absolute size-4 rounded-full bg-purple-500 sm:block hidden"
        ref={innerCircle}
      ></div>
      <Particles
        className="absolute inset-0"
        quantity={400}
        ease={20}
        color={color}
        refresh
        staticity={10}
      />

      <div className="min-h-dvh grid place-content-center sm:px-60 px-3 relative">
        <div className="fixed top-10 right-10 mx-auto place-self-end">
          <ModeToggle />
        </div>

        <div className="absolute w-full sm:h-48 h-24 m-auto left-0 right-0 top-0 bottom-0 grid place-content-center border-x-0 border-[.5px] border-gray-300">
          <div className="relative w-fit h-fit py-14 px-6 grid place-items-center border-[.5px] border-y-0 border-gray-300">
            <motion.div
              className={`relative sm:text-[160px] text-6xl font-bold sm:mt-8 mt-4 flex ${myFont.className}`}
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {text.split("").map((char, index) => (
                <Draggable key={index}>
                  <motion.span
                    key={index}
                    className="inline-block z-20 cursor-grab"
                    initial={{ rotate: Math.random() * 70 - 30 }}
                    animate={{ rotate: 0 }}
                    transition={{
                      delay: Math.random() * 2,
                      duration: Math.random() * 0.2,
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      rotate: Math.random() * 60 - 30,
                      transition: {
                        duration: 0.1,
                        ease: "easeInOut",
                        velocity: 10,
                      },
                    }}
                    drag
                    dragConstraints={{
                      top: -400,
                      left: -500,
                      right: 500,
                      bottom: 400,
                    }}
                  >
                    {char}
                  </motion.span>
                </Draggable>
              ))}
            </motion.div>
            <span
              className={`absolute font-outline-1 text-transparent sm:text-[160px] text-6xl inset-0 flex items-center justify-center sm:mt-8 mt-4 z-10 ${myFont.className}`}
            >
              Shubham
            </span>
            <div className="absolute left-0 mx-2 sm:top-8 top-2 flex items-center text-sm">
              <div className="size-2 bg-green-500 rounded-full mx-2 shadow-md shadow-green-900"></div>{" "}
              Hi, I am
            </div>
            <div className="absolute px-4 left-0 sm:bottom-2 -bottom-10 text-sm sm:w-3/4">
              and I make websites. Coding my way through the digital realm, one
              line at a time, crafting intuitive user experiences as a front-end
              developer
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-dvh">
        <Work />
      </div>
      <div className="min-h-dvh py-20">
        <div>
          <h1
            className={`relative sm:px-60 px-10 z-20 text-4xl sm:text-7xl bg-gradient-to-r from-indigo-600 via-purple-500 to-transparent inline-block text-transparent bg-clip-text font-bold sm:my-16 my-8 ${noto_Sans.className} italic`}
          >
            SPECIAL ABILITIES
            <br />
            <span className="text-sm font-extralight tracking-widest absolute">
              Engaging with Full Abilities
            </span>
          </h1>
          <Skills />
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
