"use client";
import { useRef } from "react";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import { Skills } from "@/components/skills";
import Draggable from "react-draggable";
const myFont = localFont({ src: "./fonts/UltraSolar Normal.ttf" });
import { RxArrowDown } from "react-icons/rx";
export default function Page() {
  // Create refs for each page section
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);

  // Function to scroll to the specific page section
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="snap-y snap-mandatory overflow-y-scroll h-screen bg-[#fbfbfb] text-gray-800">
      {/* Navigation bar */}
      {/* <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 z-10">
        <div className="max-w-screen-xl mx-auto flex justify-center space-x-8">
          <button
            onClick={() => scrollToSection(page1Ref)}
            className="cursor-pointer hover:text-gray-400"
          >
            Page 1
          </button>
          <button
            onClick={() => scrollToSection(page2Ref)}
            className="cursor-pointer hover:text-gray-400"
          >
            Page 2
          </button>
          <button
            onClick={() => scrollToSection(page3Ref)}
            className="cursor-pointer hover:text-gray-400"
          >
            Page 3
          </button>
          <button
            onClick={() => scrollToSection(page4Ref)}
            className="cursor-pointer hover:text-gray-400"
          >
            Page 4
          </button>
        </div>
      </nav> */}

      {/* Pages */}
      <div ref={page1Ref} className="snap-always snap-center">
        <Page1 />
      </div>
      <div ref={page2Ref} className="snap-always snap-center">
        <Page2 />
      </div>
      <div ref={page3Ref} className="snap-always snap-center">
        <Page3 />
      </div>
      <div ref={page4Ref} className="snap-always snap-center">
        <Page4 />
      </div>
    </div>
  );
}

export function Page1() {
  const text = "Shubham";

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  return (
    <div className={`relative min-h-screen flex `}>
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
  );
}

export function Page2() {
  return (
    <div className="relative min-h-screen">
      {/* <h1
        className={`${myFont.className} text-[200px] absolute top-1/2 transform -translate-y-1/2 text-right ml-20 opacity-10 font-outline-1-black text-transparent`}
      >
        Professional <br />
        Journey
      </h1> */}

      <h1 className="absolute bottom-10 left-10 border-[.5px] border-gray-400 p-8 text-2xl">
        The journey that brought <br /> me here..
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 absolute top-1/3 transform -translate-y-1/2 w-full sm:px-48 px-12 gap-x-8">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-8">
          <div className="border-[.5px] border-gray-400  border-b-orange-600 border-b-4 h-44 w-full mt-28 relative">
            <span className="text-2xl mb-4 text-left font-bold text-black absolute bottom-0 left-4">
              DEC 2022 - PRESENT
            </span>
            <span className="text-xl text-orange-600 absolute right-4 top-4 italic">
              1
            </span>
          </div>
          <div className="border-[.5px] border-gray-400  border-b-orange-600 border-b-4 h-72 relative">
            <span className="text-2xl mb-4 text-left font-bold text-black absolute bottom-0 left-4">
              AUG 2021 - NOV 2022
            </span>
            <span className="text-xl text-orange-600 absolute right-4 top-4 italic">
              2
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-8">
          <div className="border-[.5px] border-gray-400  border-b-orange-600 border-b-4 h-72 mt-28 relative">
            <span className="text-2xl mb-4 text-left font-bold text-black absolute bottom-0 left-4">
              JAN 2020 - JULY 2021
            </span>
            <span className="text-xl text-orange-600 absolute right-4 top-4 italic">
              3
            </span>
          </div>
          <div className="border-[.5px] border-gray-400  border-b-orange-600 border-b-4 h-44 place-self-end w-full mb-28 relative">
            <span className="text-2xl mb-4 text-left font-bold text-black absolute bottom-0 left-4">
              EDUCATION
            </span>
            <span className="text-xl text-orange-600 absolute right-4 top-4 italic">
              4
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 transform -translate-y-1/4 border-[.5px] border-gray-400 p-8 left-40">
        <div>The stack I’ve worked with</div>
      </div>
    </div>
  );
}

export function Page3() {
  return (
    <div className={`relative min-h-screen flex bg-red-600`}>
      <div className="container max-w-screen-xl mx-auto flex justify-center items-center text-4xl ">
        Page 3
      </div>
    </div>
  );
}

export function Page4() {
  return (
    <div className={`relative min-h-screen flex bg-red-800`}>
      <div className="container max-w-screen-xl mx-auto flex justify-center items-center text-4xl ">
        Page 4
      </div>
    </div>
  );
}
