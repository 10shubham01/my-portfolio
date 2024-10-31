"use client";

import * as React from "react";
import {
  GiShadowGrasp,
  GiMissileLauncher,
  GiStoneSpear,
  GiGhost,
  GiDatabase,
  GiParanoia,
} from "react-icons/gi";
import IconCloud from "@/components/ui/icon-cloud";
import { motion } from "framer-motion";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "express",
  "amazonaws",
  "postgresql",
  "vercel",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "figma",
  "vue",
];

type SkillKey =
  | "SHADOW CODE"
  | "PHASED DEPLOY"
  | "OBSIDIAN STRUCTURE"
  | "SHADED STEP"
  | "DEPTH OF DATA"
  | "PARANOIA";

type SkillContent = {
  [key in SkillKey]: {
    title: string;
    stack: string;
    description: string;
  };
};

export function Skills() {
  const [selectedSkill, setSelectedSkill] =
    React.useState<SkillKey>("SHADOW CODE");

  const skillContent: SkillContent = {
    "SHADOW CODE": {
      title: "SHADOW CODE",
      stack: "HTML, CSS, SCSS",
      description:
        "Instantly deploy clean, efficient code structures. I craft sleek, responsive interfaces with precision, laying the foundation of every digital experience. My HTML, CSS, and SCSS act like shadow projections, smoothly moving through browsers, enhancing user experiences, and ensuring cross-platform compatibility.",
    },
    "PHASED DEPLOY": {
      title: "PHASED DEPLOY",
      stack:
        "JavaScript, TypeScript, React.js, Vue.js, Nuxt.js, Next.js, Tailwind CSS",
      description:
        "A phased approach to front-end magic. I enter a phased world of JavaScript frameworks, seamlessly deploying modern and reactive user interfaces. Whether it’s React’s flexibility, Vue’s simplicity, or the power of Nuxt.js and Next.js, I’m equipped to enhance the experience. With Tailwind CSS, I manipulate styles with precision, like throwing shadow orbs to shape the perfect UI.",
    },
    "OBSIDIAN STRUCTURE": {
      title: "OBSIDIAN STRUCTURE",
      stack: "Bootstrap, Vuetify, Nuxt UI",
      description:
        "Craft interfaces that shield and scale. With mastery over design systems, I create structured, scalable, and cohesive components. Like conjuring shields of dark cover, Bootstrap, Vuetify, and Nuxt UI allow me to block inefficiencies and let clarity reign, enhancing both design and functionality.",
    },
    "SHADED STEP": {
      title: "SHADED STEP",
      stack: "Node.js, Adonis.js, Express.js",
      description:
        "Teleport backend logic with precision. Equipped with backend knowledge, I teleport between front-end and server-side environments, establishing robust API connections and database integrations. Node.js, Adonis.js, and Express.js empower me to build lightning-fast, scalable applications that stay in the shadows yet drive the core of the operation.",
    },
    "DEPTH OF DATA": {
      title: "DEPTH OF DATA",
      stack: "MySQL, PostgreSQL",
      description:
        "Penetrate deep into databases like a shadow orb. With a strong grasp of MySQL and PostgreSQL, I access and manipulate databases with pinpoint accuracy. My database management skills ensure data flows seamlessly, stored and retrieved like a well-placed shadow covering critical points of your application.",
    },
    PARANOIA: {
      title: "PARANOIA",
      stack: "Git",
      description:
        "Instantly track, revert, and manage code versions. With Git as my trusted weapon, I ensure that no bug escapes unnoticed. Like a shadow passing through walls, I track, commit, and deploy code across teams, reducing chaos and bringing clarity to any project. Collaboration is seamless, ensuring the whole team moves in sync.",
    },
  };

  const handleSkillSelect = (skill: SkillKey) => setSelectedSkill(skill);

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 font-extralight">
      <div className="sm:pl-60 pl-10">
        <motion.div
          key={selectedSkill}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 1 }}
          className="sm:min-h-80 min-h-96"
        >
          <h2 className="text-lg sm:text-4xl text-black dark:text-white max-w-4xl font-medium">
            {skillContent[selectedSkill].title}
          </h2>
          <p className="text-sm text-black dark:text-white mb-2">
            {skillContent[selectedSkill].stack}
          </p>
          <p className="text-xl sm:text-lg mt-8">
            {skillContent[selectedSkill].description}
          </p>
        </motion.div>
        <div className="flex gap-5 mt-4 sm:pr-0 pr-10">
          <GiShadowGrasp
            onClick={() => handleSkillSelect("SHADOW CODE")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "SHADOW CODE" ? "opacity-100" : "opacity-50"
            }`}
          />
          <GiMissileLauncher
            onClick={() => handleSkillSelect("PHASED DEPLOY")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "PHASED DEPLOY" ? "opacity-100" : "opacity-50"
            }`}
          />
          <GiStoneSpear
            onClick={() => handleSkillSelect("OBSIDIAN STRUCTURE")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "OBSIDIAN STRUCTURE"
                ? "opacity-100"
                : "opacity-50"
            }`}
          />
          <GiGhost
            onClick={() => handleSkillSelect("SHADED STEP")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "SHADED STEP" ? "opacity-100" : "opacity-50"
            }`}
          />
          <GiDatabase
            onClick={() => handleSkillSelect("DEPTH OF DATA")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "DEPTH OF DATA" ? "opacity-100" : "opacity-50"
            }`}
          />
          <GiParanoia
            onClick={() => handleSkillSelect("PARANOIA")}
            className={`size-16 cursor-pointer ${
              selectedSkill === "PARANOIA" ? "opacity-100" : "opacity-50"
            }`}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="size-96">
          <IconCloud iconSlugs={slugs} />
        </div>
      </div>
    </div>
  );
}
