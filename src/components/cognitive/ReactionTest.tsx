import TestLayout from "./TestLayout";
import { useState, useEffect } from "react";
import { TestProps } from "@/types/cognitive";

export default function ReactionTest({ onComplete }: TestProps) {
  const [waiting, setWaiting] = useState(true);
  const [start, setStart] = useState<number | null>(null);

  useEffect(() => {
    const delay = Math.random() * 3000 + 2000;

    const t = setTimeout(() => {
      setWaiting(false);
      setStart(Date.now());
    }, delay);

    return () => clearTimeout(t);
  }, []);

  const click = () => {
    if (waiting || !start) return;

    const time = Date.now() - start;
    const score = time < 300 ? 10 : time < 600 ? 5 : 2;

    onComplete(score);
  };

  return (
    <TestLayout
      title="Reaction Test"
      subtitle="Click when it turns green"
    >
      <div
        onClick={click}
        className={`h-40 rounded-2xl flex items-center justify-center text-white text-xl cursor-pointer transition-all
          ${waiting ? "bg-red-500" : "bg-green-500"}
        `}
      >
        {waiting ? "Wait..." : "CLICK!"}
      </div>
    </TestLayout>
  );
}