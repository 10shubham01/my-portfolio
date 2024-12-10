"use client";
import { motion } from "framer-motion";

type Icon = {
  src: string;
  alt: string;
};

const icons: Icon[] = [
  { src: "/icons8-javascript.svg", alt: "javascript" },
  { src: "/icons8-nextjs.svg", alt: "nextjs" },
  { src: "/icons8-react.svg", alt: "react" },
  { src: "/icons8-typescript.svg", alt: "typescript" },
  { src: "/icons8-vuejs.svg", alt: "vuejs" },
  { src: "/icons8-nuxt-js.svg", alt: "nuxt" },
  { src: "/icons8-nodejs.svg", alt: "nodejs" },
  { src: "/icons8-tailwind-css.svg", alt: "tailwind-css" },
  { src: "/icons8-express-js.svg", alt: "express" },
  { src: "/icons8-postgresql.svg", alt: "postgresql" },
];

const DraggableIcons: React.FC = () => {
  const pyramidStructure = [
    [icons[0], icons[1], icons[2], icons[3]], // 4 icons in first row
    [icons[4], icons[5], icons[6]], // 3 icons in second row
    [icons[7], icons[8]], // 2 icons in third row
    [icons[9]], // 1 icon in last row
  ];

  return (
    <div className="relative">
      <h2 className="text-center text-3xl mb-6 tracking-widest">
        My Skillset: The Powerhouse of Code!!
      </h2>

      {pyramidStructure.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center gap-x-6 ${
            rowIndex === 0
              ? "mb-4"
              : rowIndex === 1
              ? "mb-6"
              : rowIndex === 2
              ? "mb-8"
              : "mb-10"
          }`}
        >
          {row.map((icon) => (
            <motion.img
              dragMomentum={false}
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              className="cursor-pointer sm:size-32 size-16"
              drag
              whileHover={{ scale: 1.2 }}
              whileDrag={{ scale: 0.8 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DraggableIcons;
