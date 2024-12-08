import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const fontSize = 100;
const padding = 15;
const height = fontSize + padding;

export default function Counter({ value }: { value: number }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ fontSize }}
      className="flex space-x-3 overflow-hidden rounded px-2 leading-none text-white"
    >
      {String(value)
        .split("")
        .map((_v, index) => (
          <Digit place={Math.pow(10, index)} key={index} value={value} />
        ))
        .reverse()}
    </motion.div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  const animatedValue = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const valueRoundedToPlace = Math.floor(value / place);
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, value, place]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center font-mono font-bold"
    >
      {number}
    </motion.span>
  );
}
