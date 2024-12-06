"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Fasthand, Instrument_Serif } from "next/font/google";
import { IoMdMove } from "react-icons/io";
import SnakeGame from "@/components/snake";
import Github from "@/components/github";

const fasthand = Fasthand({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
});

const instrument_Serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
  style: ["italic"],
});

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false); // Track if dragging

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <div className={`h-screen p-2 text-white ${fasthand.className}`}>
      <div
        className="size-full relative overflow-hidden border flex justify-center items-center bg-neutral-900 !cursor-grab"
        ref={ref}
      >
        <motion.div
          className="child h-[250vh] min-w-[250vw] bg-[url('/gridImage.svg')] bg-repeat flex justify-center items-center relative !z-20"
          style={{
            backgroundSize: "40px 40px",
            backgroundBlendMode: "hard-light",
          }}
          drag
          dragMomentum={false}
          dragConstraints={ref}
        >
          <div className="relative h-screen flex flex-col justify-around py-32 items-center w-screen text-center grand-child">
            <h1
              className={`sm:text-4xl text-2xl italic ${instrument_Serif.className} px-10`}
            >
              Find everything about me on this canvas!!
            </h1>
            <div className={`text-left ${instrument_Serif.className}`}>
              <h1 className={`sm:text-9xl text-4xl`}>
                {"<Frontend Developer />"}
              </h1>
              <span className="sm:text-4xl text-xl sm:mx-36 mx-12">
                Shubham Gupta
              </span>
            </div>
            <div
              className={`opacity-75 w-fit flex items-center font-semibold tracking-wider  ${instrument_Serif.className}`}
            >
              <IoMdMove className="mx-2" />
              DRAG TO MOVE
            </div>
            <motion.div
              drag
              onClickCapture={(e) => {
                if (!dragging) {
                  window.open("https://github.com/10shubham01", "_blank");
                }
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragMomentum={false}
              className={`${instrument_Serif.className} absolute -top-20 -left-20 size-48 bg-[url('/icons8-github.svg')] rounded-3xl p-0 rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-cover`}
            ></motion.div>
            <motion.div
              drag
              onClickCapture={(e) => {
                if (!dragging) {
                  window.open(
                    "https://www.linkedin.com/in/shubhamgupta001/",
                    "_blank"
                  );
                }
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragMomentum={false}
              className="absolute -top-20 left-20 size-52 rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-[url('/icons8-linkedin.svg')] bg-cover"
            ></motion.div>
            <div
              className={`absolute sm:top-40 top-32 left-16 text-4xl -rotate-6`}
            >
              get in touch
            </div>
            <div className="absolute -bottom-96 -right-96">
              <SnakeGame></SnakeGame>
            </div>
            <div className="absolute -bottom-1/4 left-10">
              <Github></Github>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
