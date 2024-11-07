import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// Define the type for each item in the list
interface Item {
  id: number;
  title: string;
  stack: string;
  description: string;
}

export const Skills: React.FC = () => {
  // Initial list of items
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      title: "SHADOW CODE",
      stack: "HTML, CSS, SCSS",
      description:
        "Instantly deploy clean, efficient code structures. I craft sleek, responsive interfaces with precision, laying the foundation of every digital experience. My HTML, CSS, and SCSS act like shadow projections, smoothly moving through browsers, enhancing user experiences, and ensuring cross-platform compatibility.",
    },
    {
      id: 2,
      title: "PHASED DEPLOY",
      stack:
        "JavaScript, TypeScript, React.js, Vue.js, Nuxt.js, Next.js, Tailwind CSS",
      description:
        "A phased approach to front-end magic. I enter a phased world of JavaScript frameworks, seamlessly deploying modern and reactive user interfaces. Whether it’s React’s flexibility, Vue’s simplicity, or the power of Nuxt.js and Next.js, I’m equipped to enhance the experience. With Tailwind CSS, I manipulate styles with precision, like throwing shadow orbs to shape the perfect UI.",
    },
    {
      id: 3,
      title: "OBSIDIAN STRUCTURE",
      stack: "Bootstrap, Vuetify, Nuxt UI",
      description:
        "Craft interfaces that shield and scale. With mastery over design systems, I create structured, scalable, and cohesive components. Like conjuring shields of dark cover, Bootstrap, Vuetify, and Nuxt UI allow me to block inefficiencies and let clarity reign, enhancing both design and functionality.",
    },
    {
      id: 4,
      title: "SHADED STEP",
      stack: "Node.js, Adonis.js, Express.js",
      description:
        "Teleport backend logic with precision. Equipped with backend knowledge, I teleport between front-end and server-side environments, establishing robust API connections and database integrations. Node.js, Adonis.js, and Express.js empower me to build lightning-fast, scalable applications that stay in the shadows yet drive the core of the operation.",
    },
    {
      id: 5,
      title: "DEPTH OF DATA",
      stack: "MySQL, PostgreSQL",
      description:
        "Penetrate deep into databases like a shadow orb. With a strong grasp of MySQL and PostgreSQL, I access and manipulate databases with pinpoint accuracy. My database management skills ensure data flows seamlessly, stored and retrieved like a well-placed shadow covering critical points of your application.",
    },
    {
      id: 6,
      title: "PARANOIA",
      stack: "Git",
      description:
        "Instantly track, revert, and manage code versions. With Git as my trusted weapon, I ensure that no bug escapes unnoticed. Like a shadow passing through walls, I track, commit, and deploy code across teams, reducing chaos and bringing clarity to any project. Collaboration is seamless, ensuring the whole team moves in sync.",
    },
  ]);

  const handleClick = (id: number) => {
    setItems((prevItems) => {
      // Find the clicked item
      const clickedItem = prevItems.find((item) => item.id === id);
      if (!clickedItem) return prevItems;

      const sortedItems = prevItems
        .filter((item) => item.id !== id)
        .sort((a, b) => a.id - b.id);

      return [clickedItem, ...sortedItems];
    });
  };

  return (
    <div className="">
      <div className="grid sm:grid-cols-6 grid-cols-4 w-fit my-12">
        <Image
          src="/icons8-html5.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-tailwind-css.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-javascript.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-nodejs.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-github.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-express-js.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-react.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-nextjs.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-vuejs.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-nuxt-js.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-typescript.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
        <Image
          src="/icons8-postgresql.svg"
          width="100"
          height="100"
          alt=""
          className="border-[.5px] p-2 hover:dark:shadow-gray-600  dark:shadow hover:saturate-[10] saturate-200 hover:shadow-lg z-50 border-gray-300"
        />
      </div>
      {/* <AnimatePresence>
        <div className="grid sm:grid-cols-5 grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 5000 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5000 }}
              transition={{ duration: 1 }}
              onClick={() => handleClick(item.id)}
              className={`border z-50 py-10 px-5 group ${
                index === 0 ? "sm:col-span-5 col-span-2 h-auto border-b-0" : ""
              }`}
              style={{
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <h1
                className={`${
                  index !== 0
                    ? "group-hover:border-b dark:border-white border-black  inline-block"
                    : "text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500"
                } `}
              >
                {item.id}. {item.title}
              </h1>

              {index === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <p className="text-xs text-white dark:text-black mb-2 dark:bg-white bg-black px-2 py-[2px] font-normal tracking-widest rounded my-1">
                    {item.stack}
                  </p>{" "}
                  <p>{item.description}</p>
                </motion.div>
              ) : (
                ""
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence> */}
    </div>
  );
};
