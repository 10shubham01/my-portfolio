"use client";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRef, useState } from "react";
import { Fasthand, Instrument_Serif } from "next/font/google";
import SnakeGame from "@/components/snake";
import Github from "@/components/github";
import Sticky from "@/components/sticky";
import { sendGTMEvent } from "@next/third-parties/google";
import Experiance from "@/components/experieance";
import TicTacToe from "@/components/tictactoe";
import Skills from "@/components/skills";
import Projects from "@/components/porjects";

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
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shubham Gupta",
              alternateName: ["Shubham", "Gupta"],
              jobTitle: "Senior Software Engineer",
              description: "Expert Frontend Developer and Full Stack Engineer specializing in React, Next.js, Vue.js, and TypeScript",
              worksFor: {
                "@type": "Organization",
                name: "Credilio",
                url: "https://credilio.com"
              },
              url: "https://www.shubhamgupta.dev",
              sameAs: [
                "https://github.com/10shubham01",
                "https://www.linkedin.com/in/shubhamgupta001/",
                "https://peerlist.io/10shubham01/project/shubhams-portfolio"
              ],
              knowsAbout: [
                "Frontend Development",
                "Web Development",
                "React.js",
                "Next.js",
                "Vue.js",
                "TypeScript",
                "JavaScript",
                "Full Stack Development",
                "UI/UX Design",
                "Progressive Web Apps"
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Frontend Developer",
                description: "Professional web developer with expertise in modern frontend technologies"
              },
              alumniOf: {
                "@type": "Organization",
                name: "Software Engineering Education"
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "India"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Shubham Gupta Portfolio",
              description: "Professional portfolio of Shubham Gupta - Frontend Developer, Web Developer, and Full Stack Engineer",
              url: "https://www.shubhamgupta.dev",
              author: {
                "@type": "Person",
                name: "Shubham Gupta"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.shubhamgupta.dev?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shubham Gupta Web Development Services",
              description: "Professional web development services including frontend development, React development, and full-stack solutions",
              url: "https://www.shubhamgupta.dev",
              logo: "https://www.shubhamgupta.dev/images/profile.jpeg",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "shubhamedu.01@gmail.com"
              },
              sameAs: [
                "https://github.com/10shubham01",
                "https://www.linkedin.com/in/shubhamgupta001/"
              ]
            }),
          }}
        />
      </Head>
      <main className={`h-screen sm:p-2 text-white ${fasthand.className}`}>
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
                  alt="Drag to navigate portfolio"
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
                  alt="Download Shubham Gupta's Resume"
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
                aria-label="Visit Shubham Gupta's GitHub Profile"
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
                aria-label="Contact Shubham Gupta via Email"
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
                aria-label="Download Shubham Gupta's Resume"
              >
                <a href="/public/file.svg" className="size-full" download aria-label="Download Resume PDF"></a>
              </motion.div>
              <motion.div
                drag
                onClickCapture={() => {
                  if (!dragging) {
                    window.open(
                      "https://peerlist.io/10shubham01/project/shubhams-portfolio",
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
                className="bg-[url('/week_medal_2.svg')] size-32 bg-contain bg-no-repeat hover:rotate-0 hover:scale-105 transition-all cursor-grab hover:saturate-200 absolute top-1/2 right-28 rotate-12"
                aria-label="View Shubham Gupta's Portfolio on Peerlist"
              ></motion.div>
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
                aria-label="Connect with Shubham Gupta on LinkedIn"
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
            <section className="absolute top-10" aria-label="Work Experience">
              <Experiance></Experiance>
            </section>
            <section className="absolute top-10 left-10" aria-label="Interactive Tic Tac Toe Game">
              <TicTacToe></TicTacToe>
            </section>
            <section className="absolute bottom-96 left-52" aria-label="Technical Skills">
              <Skills></Skills>
            </section>
            <section className="absolute bottom-1/2 sm:right-72 right-20" aria-label="Projects Portfolio">
              <Projects></Projects>
            </section>
          </motion.div>
        </div>
      </main>
    </>
  );
}
