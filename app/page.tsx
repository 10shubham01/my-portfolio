"use client";
import React, { useEffect, useState, useRef } from "react";
export const runtime = "edge";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Work } from "@/components/work";
import { Noto_Sans, Stalinist_One, Bungee_Outline } from "next/font/google";
import { ModeToggle } from "@/components/toogle-theme";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { Skills } from "@/components/skills";
import CardDemo from "@/components/blocks/cards-demo-3";

const noto_Sans = Bungee_Outline({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
});

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
    <BackgroundBeamsWithCollision className="relative !cursor-none">
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
      <div className="min-h-dvh grid place-content-center sm:px-60 px-3">
        <div className="sm:fixed top-10 sm:left-10 mx-auto place-self-end mb-20 mt-10">
          <ModeToggle />
        </div>
        <h2
          className={`z-20 text-7xl sm:text-9xl  font-bold ${noto_Sans.className} bg-gradient-to-r from-indigo-600 via-purple-500 to-transparent inline-block text-transparent bg-clip-text`}
        >
          {"Shubham"}
          <span ref={periodRef}></span> {/* Wrapped period in span */}
        </h2>
        <div className="sm:m-2 mt-4 ml-2 text-xl sm:text-2xl sm:pr-20 font-extralight">
          <p>
            A shadow in the code, Your go-to front-end developer, UX architect,
            and JavaScript engineer, ready to bring ideas to life on the digital
            canvas! Whether it’s day or night, I'm all about turning lines of
            code into captivating, interactive experiences.
            <br /> <br />I live by a minimalist mantra, finding beauty in
            simplicity and order. When I’m not crafting web magic, you can find
            me strategizing my next move in Valorant.
            <br />
            <br />
            let's team up and create something unforgettable!
          </p>
          <div>
            <CardDemo></CardDemo>
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
