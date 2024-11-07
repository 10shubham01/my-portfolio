import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Skills } from "./skills";
import CardDemo from "./blocks/cards-demo-3";

export function Work() {
  const data = [
    {
      title: "ABOUT ME",
      content: (
        <div className="sm:m-2 mt-4 ml-2 text-xl sm:text-2xl sm:pr-20 font-extralight min-h-fit border">
          {/* <p>
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
          </p> */}
          {/* <div>
            <CardDemo></CardDemo>
          </div> */}

          <h1>I am Shubham Gupta</h1>
        </div>
      ),
    },
    {
      title: "DEC 2022 - PRESENT",
      content: (
        <div className="min-h-fit border">
          <h1 className="text-neutral-800 dark:text-neutral-200 text-sm md:text-xl font-normal mb-8">
            Senior Software Engineer - Credilio Financial Technologies
          </h1>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Responsible for translating business requirements into end-user
            experiences and design specifications, ensuring they are delivered
            as high-quality, production-ready code.
          </p>
          <ul className="list-disc">
            <li>
              Built scalable projects from the ground up with well-defined
              architectures, organizing components, composables, and utilities
              for optimal performance and maintainability.
            </li>
            <li>
              Enhanced web app performance and maintainability by migrating from
              Nuxt 2 to Nuxt 3, achieving a 30% improvement in load times and a
              20% reduction in code complexity.
            </li>
            <li>
              Integrated REST APIs to streamline data exchange with multiple
              bank systems.
            </li>
            <li>
              Spearheaded the development of "Plug and Play," enabling seamless
              partner portal integration.
            </li>
            <li>
              Collaborated closely with graphic designers and product managers
              to interpret and implement user experience specifications.
            </li>
            <li>
              Developed secure web portals with role-based access control,
              protecting user data.
            </li>
            <li>
              Improved user experience by collaborating with graphic designers
              and product managers.
            </li>
            <li>
              Utilized performance tools (Lighthouse, PageSpeed) to optimize web
              app load times, achieving a 95/100 in performance, 98/100 in
              accessibility, 93/100 in best practices, and 93/100 in SEO.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "AUG 2021 - NOV 2022",
      content: (
        <div className="min-h-fit border">
          <h1 className="text-neutral-800 dark:text-neutral-200 text-sm md:text-xl font-normal mb-8">
            Software Engineer (Consultant) - Mountblue
          </h1>
          <ul className="list-disc">
            <li>
              Developed robust APIs with Node.js, Express.js, and
              PostgreSQL/MySQL databases.
            </li>
            <li>
              Delivered high-quality code through rigorous bootcamp training and
              code reviews.
            </li>
            <li>
              Built dynamic web applications using modern JavaScript frameworks
              and libraries like Vue.js and React.js.
            </li>
            <li>
              Deployed to Credilio Financial Technologies as a consultant,
              translating business requirements into high-quality code.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "JAN 2020 - JULY 2021",
      content: (
        <div className="min-h-fit border">
          <h1 className="text-neutral-800 dark:text-neutral-200 text-sm md:text-xl font-normal mb-8">
            Freelance - TedX, Freedom MUN 2.0 , Freedom MUN
          </h1>
          <ul className="list-disc">
            <li>
              Designed and developed event web portals using Figma, HTML5, CSS,
              and JavaScript.
            </li>
            <li>
              Created digital boards and email templates with Adobe Photoshop.
            </li>
            <li>
              Implemented form submissions with Email.js for e cient data
              collection.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "SPECIAL ABILITIES",
      content: (
        <div className="min-h-fit border">
          {" "}
          <Skills></Skills>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full font-extralight">
      <Timeline data={data} />
    </div>
  );
}
