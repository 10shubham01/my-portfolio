"use client";
import React, { useEffect, useState, useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Work } from "@/components/work";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  DiscordLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { Noto_Sans } from "next/font/google";
import { ModeToggle } from "@/components/toogle-theme";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { Skills } from "@/components/skills";

const noto_Sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "900"],
  style: ["italic"],
  preload: true,
});

export default function BackgroundBeamsWithCollisionDemo() {
  const { theme } = useTheme();
  const [color, setColor] = useState<string>("#ffffff");
  const circleRef = useRef<HTMLDivElement>(null);
  const innerCircle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  useEffect(() => {
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
        className="absolute size-3 rounded-full dark:bg-white bg-black top-28 left-28 sm:block hidden"
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
        <div className="sm:fixed sm:top-20 top-10 sm:left-20 mx-auto place-self-end mb-20">
          <ModeToggle />
        </div>
        <h2
          className={`z-20 text-5xl sm:text-7xl text-black dark:text-white  sm:tracking-[-3px] font-bold sm:my-16 mb-3 ${noto_Sans.className} italic`}
        >
          SHUBHAM
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
          <div className="flex mt-8">
            <a href="https://github.com/10shubham01" target="_blank">
              <GitHubLogoIcon className="size-5 cursor-pointer" />
            </a>
            <a href="mailto:shubhamedu.01@gmail.com">
              <EnvelopeClosedIcon className="size-5 mx-3 cursor-pointer" />
            </a>
            <a href="https://discord.com/users/V0LD3M0R7" target="_blank">
              <DiscordLogoIcon className="size-5 mx-2 cursor-pointer" />
            </a>
            <a
              href="https://www.linkedin.com/in/shubhamgupta001/"
              target="_blank"
            >
              <LinkedInLogoIcon className="size-5 mx-2 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
      <div className="min-h-dvh">
        <Work />
      </div>
      <div className="min-h-dvh py-20">
        <div>
          <h1
            className={`relative sm:px-60 px-10 z-20 text-4xl sm:text-7xl text-black dark:text-white font-bold sm:my-16 my-8 ${noto_Sans.className} italic`}
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
      <div className="min-h-dvh py-20"></div>
    </BackgroundBeamsWithCollision>
  );
}
