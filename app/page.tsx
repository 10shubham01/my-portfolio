"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Fasthand, Instrument_Serif } from "next/font/google";
import SnakeGame from "@/components/snake";
import Github from "@/components/github";
import Sticky from "@/components/sticky";
import { sendGTMEvent } from "@next/third-parties/google";
import Experiance from "@/components/experieance";
import TicTacToe from "@/components/tictactoe";
import Skills from "@/components/skills";

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
    <div className={`h-screen sm:p-2 text-white ${fasthand.className}`}>
      <div
        className="size-full relative overflow-hidden border flex justify-center items-center bg-neutral-900 !cursor-grab"
        ref={ref}
      >
        <motion.div
          className="child sm:h-[250vh] h-[450vh] sm:min-w-[250vw] min-w-[550vw] bg-[url('/gridImage.svg')] bg-repeat flex justify-center items-center relative !z-20"
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
              className={`opacity-75 w-fit flex items-center font-semibold tracking-widest font-sans`}
            >
              <img
                src="/com-video-to-gif-converter-unscreen.gif"
                className="invert size-16"
                alt=""
              />
              DRAG TO MOVE
            </div>
            <div className="absolute sm:-top-1/2 -top-3/4 -left-1/3">
              <Sticky></Sticky>
              <motion.img
                drag
                dragMomentum={false}
                src="/download.png"
                className="sm:size-40 size-20 mt-20 -rotate-6 hover:scale-110 transition-all hover:rotate-0 hover:saturate-200"
              ></motion.img>
            </div>
            <motion.div
              drag
              onClickCapture={() => {
                if (!dragging) {
                  window.open("https://github.com/10shubham01", "_blank");
                }
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragMomentum={false}
              className={`absolute -top-20 -left-20 size-48 bg-[url('/icons8-github.svg')] rounded-3xl p-0 rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-cover hover:saturate-200`}
            ></motion.div>
            <motion.div
              drag
              onClickCapture={() => {
                if (!dragging) {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=shubhamedu.01@gmail.com",
                    "_blank"
                  );
                }
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragMomentum={false}
              className={`${instrument_Serif.className} absolute -top-10 -left-40 size-48 bg-[url('/icons8-gmail.svg')] rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-cover hover:saturate-200`}
            ></motion.div>
            <motion.div
              drag
              onClickCapture={() => {
                if (!dragging) {
                  window.open(
                    "https://pub-37e1aa402ba24ef28ab68650caa7a432.r2.dev/Shubham's_Resume.pdf",
                    "_blank"
                  );
                  sendGTMEvent({
                    event: "ResumeDownloaded",
                    value: true,
                  });
                }
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragMomentum={false}
              className={`absolute -top-10 -right-10 size-48 bg-[url('/icons8-document.svg')] rounded-3xl p-0 rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-cover hover:saturate-200`}
            >
              <a href="/public/file.svg" className="size-full" download></a>
            </motion.div>
            <motion.div
              drag
              onClickCapture={() => {
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
              className="absolute -top-20 left-20 size-52 rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-[url('/icons8-linkedin.svg')] bg-cover hover:saturate-200"
            ></motion.div>
            <div
              className={`absolute sm:top-40 top-32 left-16 sm:text-4xl text-xl -rotate-6`}
            >
              get in touch
            </div>
            <div
              className={`absolute sm:top-40 top-32 right-16 sm:text-4xl text-xl rotate-6`}
            >
              Download Resume
            </div>
            <div className="absolute -bottom-96 -right-96 sm:block hidden">
              <SnakeGame></SnakeGame>
            </div>
            <div className="absolute -bottom-60 sm:left-4">
              <Github></Github>
            </div>
          </div>
          <div className="absolute top-10">
            <Experiance></Experiance>
          </div>
          <div className="absolute top-10 left-10">
            <TicTacToe></TicTacToe>
          </div>
          <div className="absolute bottom-96 left-52">
            <Skills></Skills>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
