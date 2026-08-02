import { animate, motionValue } from "motion";
import { useEffect, useState } from "react";

interface CounterProps {
  value: number;
}

const Counter = ({ value }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const mv = motionValue(0);

    const unsubscribe = mv.on("change", (latest) => {
      setCount(Math.round(latest));
    });

    const controls = animate(mv, value, {
      duration: 1.5,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [value]);

  return (
    <span className="text-6xl font-bold text-white">
      {count.toLocaleString()}
    </span>
  );
};

export default Counter;
