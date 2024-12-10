import { motion } from "framer-motion";
export default function Experiance() {
  return (
    <>
      <div className="flex justify-center">
        <motion.div
          drag
          dragMomentum={false}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative size-[400px] -rotate-12 hover:rotate-0 hover:scale-110 transition-all  hover:saturate-200">
            <p className="text-lg tracking-widest absolute top-20 z-10 left-4 text-white px-20">
              <span className="bg-yellow-500"> Since December 2022: </span>{" "}
              <br /> 🎩 Rocking the Senior Software Engineer hat at{" "}
              <a
                href="https://www.credilio.in/"
                target="_blank"
                className="bg-blue-700"
              >
                Credilio
              </a>
              , 🖥️ crafting code, 🐛 fixing bugs, and 🤔 occasionally wondering
              if semicolons dream of electric sheep. 🐑✨
            </p>
            <img src="/icons8-file.svg" className="absolute top-0" />
          </div>
        </motion.div>
        <motion.div
          drag
          dragMomentum={false}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative size-[400px] rotate-12 hover:rotate-0 hover:scale-110 transition-all  hover:saturate-200 mt-20">
            <p className="text-lg tracking-widest absolute top-20 z-10 left-4 text-white px-20">
              <span className="bg-yellow-500"> Aug 2021 – Nov 2022: </span>{" "}
              <br /> 🛠️ Kicked off the coding journey as a Software
              Engineer/Trainee at{" "}
              <a
                href="https://www.mountblue.io/"
                target="_blank"
                className="bg-blue-700"
              >
                {" "}
                MountBlue
              </a>
              , 🚀 debugging, learning, and turning caffeine into clean code
              ☕💻.
            </p>
            <img src="/icons8-file.svg" className="absolute top-0" />
          </div>
        </motion.div>
        <motion.div
          drag
          dragMomentum={false}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative size-[400px] -rotate-12 hover:rotate-0 hover:scale-110 transition-all  hover:saturate-200">
            <p className="text-lg tracking-widest absolute top-20 z-10 left-4 text-white px-20">
              <span className="bg-yellow-500"> 2018–2021:</span> <br /> 🎓
              Earned my BCA degree from{" "}
              <a href="https://www.lpu.in/" className="bg-orange-500">
                Lovely Professional University{" "}
              </a>
              , where I mastered coding, crammed for exams, and occasionally
              wondered if my assignments could debug themselves. 🌟💻
            </p>
            <img src="/icons8-file.svg" className="absolute top-0" />
          </div>
        </motion.div>
      </div>
      <div>
        <h1 className="text-3xl tracking-widest text-center mt-2 -rotate-12">
          The changelog of my journey.
        </h1>
      </div>
    </>
  );
}
