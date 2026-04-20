import TestLayout from "./TestLayout";
import { useState } from "react";
import { TestProps } from "@/types/cognitive";

const colors = ["red", "blue", "green"];

export default function StroopTest({ onComplete }: TestProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const next = () => {
    if (round >= 5) {
      onComplete(score);
      return;
    }
    setRound((r) => r + 1);
  };

  const word = colors[Math.floor(Math.random() * 3)];
  const color = colors[Math.floor(Math.random() * 3)];

  return (
    <TestLayout
      title="Stroop Test"
      subtitle="Select the TEXT color, not the word"
    >
      <h2 className="text-center text-3xl font-bold" style={{ color }}>
        {word.toUpperCase()}
      </h2>

      <div className="flex justify-center gap-3">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => {
              if (c === color) setScore((s) => s + 2);
              next();
            }}
            className="px-4 py-2 rounded-xl border"
          >
            {c}
          </button>
        ))}
      </div>
    </TestLayout>
  );
}