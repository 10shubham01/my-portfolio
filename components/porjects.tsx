"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Projects() {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl tracking-widest text-center sm:mb-32 mb-10">
        My Cool Projects
      </h2>
      <div className="grid sm:gap-2 grid-cols-3">
        <div className="relative group">
          <motion.div
            drag
            onClickCapture={() => {
              if (!dragging) {
                window.open(
                  "https://chromewebstore.google.com/detail/spotlight-chrome-extensio/abbhoiaihkicmgmmglcomckkbcmdnjpp?authuser=1&hl=en",
                  "_blank"
                );
              }
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:size-52 size-20 rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-[url('/icons8-spotlight-96.png')] bg-cover hover:saturate-200"
          ></motion.div>
          <h3 className="text-xl tracking-widest text-center sm:mt-28 mt-10">
            Spotlight Chrome Extension
          </h3>
        </div>

        <div className="relative group">
          <motion.div
            drag
            onClickCapture={() => {
              if (!dragging) {
                window.open("https://symbiote-ui.vercel.app/", "_blank");
              }
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:size-52 size-20 rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-[url('/icons8-venom-head.svg')] bg-cover hover:saturate-200"
          ></motion.div>
          <h3 className="text-xl tracking-widest text-center sm:mt-28 mt-10">
            Symbiote UI
          </h3>
        </div>

        <div className="relative group">
          <motion.div
            drag
            onClickCapture={() => {
              if (!dragging) {
                window.open("https://github.com/10shubham01/api-log", "_blank");
              }
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:size-52 size-20 rounded-3xl p-0 -rotate-12 hover:rotate-0 hover:scale-105 transition-all cursor-grab bg-[url('/icons8-log-96.png')] bg-cover invert hover:saturate-200"
          ></motion.div>
          <h3 className="text-xl tracking-widest text-center sm:mt-28 mt-10">
            API Log
          </h3>
        </div>
      </div>
    </div>
  );
}
