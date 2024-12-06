/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

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
    if (!isRunning) return;
    if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
  };

  // Game loop
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

  const startGame = () => {
    setSnake([[5, 5]]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setIsRunning(true);
  };

  return (
    <div className="relative">
      <div
        className="relative border-[.5px]"
        style={{
          width: `${gridSize * 15}px`,
          height: `${gridSize * 15}px`,
        }}
      >
        {/* Snake */}
        {snake.map(([x, y], index) => {
          const segmentOpacity = (index + 1) / snake.length;
          const segmentHeight = 15 * segmentOpacity;
          return (
            <div
              key={index}
              className={`absolute ${
                index === snake.length - 1
                  ? "bg-yellow-400 rounded-full"
                  : index === 0
                  ? "border"
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
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={startGame} className="text-6xl text-white">
            {gameOver ? <VscDebugRestart /> : "▶"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
