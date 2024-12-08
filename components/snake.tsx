/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaCaretUp,
  FaCaretDown,
  FaCaretRight,
  FaCaretLeft,
} from "react-icons/fa6";
import Counter from "./counter";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const gridSize = 30;

  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return [x, y];
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];

    let newHead;
    if (direction === "UP") newHead = [head[0], head[1] - 1];
    if (direction === "DOWN") newHead = [head[0], head[1] + 1];
    if (direction === "LEFT") newHead = [head[0] - 1, head[1]];
    if (direction === "RIGHT") newHead = [head[0] + 1, head[1]];

    if (
      !newHead ||
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= gridSize ||
      newHead[1] >= gridSize ||
      newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      setIsRunning(false);
      return;
    }

    newSnake.push(newHead);

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood(generateFood());
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      if (gameOver) resetGame();
      else setIsRunning((prev) => !prev);
      return;
    }

    if (!isRunning) return;

    if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");

    setActiveKey(e.key.replace("Arrow", "").toUpperCase());
  };

  const handleButtonPress = (dir: Direction) => {
    if (!isRunning) return;

    if (dir === "UP" && direction !== "DOWN") setDirection("UP");
    if (dir === "DOWN" && direction !== "UP") setDirection("DOWN");
    if (dir === "LEFT" && direction !== "RIGHT") setDirection("LEFT");
    if (dir === "RIGHT" && direction !== "LEFT") setDirection("RIGHT");

    setActiveKey(dir);
  };

  useEffect(() => {
    if (isRunning && !gameOver) {
      const interval = setInterval(moveSnake, 150);
      return () => clearInterval(interval);
    }
  }, [snake, direction, isRunning]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isRunning]);

  useEffect(() => {
    if (activeKey) {
      const timeout = setTimeout(() => setActiveKey(null), 100);
      return () => clearTimeout(timeout);
    }
  }, [activeKey]);

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setIsRunning(true);
  };

  return (
    <div className="relative w-fit h-fit">
      <Counter value={snake.length}></Counter>
      <div
        className={`relative border`}
        style={{
          width: `${gridSize * 15}px`,
          height: `${gridSize * 15}px`,
        }}
      >
        {snake.map(([x, y], index) => {
          const segmentOpacity = (index + 1) / snake.length;
          const segmentHeight = 15 * segmentOpacity;
          return (
            <div
              key={index}
              className={`absolute ${
                index === snake.length - 1
                  ? "bg-yellow-400 rounded-full"
                  : "bg-green-500"
              }`}
              style={{
                width: "15px",
                height: `${segmentHeight}px`,
                top: `${y * 15 + (15 - segmentHeight) / 2}px`,
                left: `${x * 15}px`,
                opacity: segmentOpacity,
              }}
            />
          );
        })}

        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            width: "15px",
            height: "15px",
            top: `${food[1] * 15}px`,
            left: `${food[0] * 15}px`,
          }}
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center top-0 h-full w-full mt-20">
          <p className="text-2xl text-rose-500 tracking-widest">
            Game Over! Press Space to Restart
          </p>
        </div>
      )}

      {!isRunning && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center top-0 h-full w-full mt-20">
          <p className="text-2xl text-white tracking-widest">
            Press Space to Start/Resume
          </p>
        </div>
      )}

      <div className="absolute -bottom-32 w-full -rotate-12">
        <div className="flex flex-col justify-center items-center">
          <motion.button
            drag
            dragMomentum={false}
            onClick={() => handleButtonPress("UP")}
            className={`w-16 h-8 bg-black text-white grid place-items-center text-xl rounded-md shadow shadow-white focus-visible:outline-none ${
              activeKey === "UP" ? "shadow-none" : ""
            }`}
          >
            <FaCaretUp />
          </motion.button>
          <div className="flex justify-center items-start gap-2 mt-1">
            <motion.button
              drag
              dragMomentum={false}
              onClick={() => handleButtonPress("LEFT")}
              className={`w-16 h-8 bg-black text-white grid place-items-center text-xl rounded-md shadow shadow-white focus-visible:outline-none ${
                activeKey === "LEFT" ? "shadow-none" : ""
              }`}
            >
              <FaCaretLeft />
            </motion.button>
            <motion.button
              drag
              dragMomentum={false}
              onClick={() => handleButtonPress("DOWN")}
              className={`w-16 h-8 bg-black text-white grid place-items-center text-xl rounded-md shadow shadow-white focus-visible:outline-none ${
                activeKey === "DOWN" ? "shadow-none" : ""
              }`}
            >
              <FaCaretDown />
            </motion.button>
            <motion.button
              drag
              dragMomentum={false}
              onClick={() => handleButtonPress("RIGHT")}
              className={`w-16 h-8 bg-black text-white grid place-items-center text-xl rounded-md shadow shadow-white focus-visible:outline-none ${
                activeKey === "RIGHT" ? "shadow-none" : ""
              }`}
            >
              <FaCaretRight />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
