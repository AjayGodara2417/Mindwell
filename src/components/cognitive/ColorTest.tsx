"use client";

import { useState } from "react";
import TestLayout from "./TestLayout";
import { TestProps } from "@/types/cognitive";

const words = ["RED", "BLUE", "GREEN"];
const colors = ["red", "blue", "green"];

export default function ColorTest({ onComplete }: TestProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const maxRounds = 5;

  const word = words[Math.floor(Math.random() * 3)];
  const textColor = colors[Math.floor(Math.random() * 3)];

  const handleAnswer = (selected: string) => {
    // ✅ Correct logic: match actual TEXT COLOR
    if (selected === textColor) {
      setScore((s) => s + 2);
    }

    if (round + 1 >= maxRounds) {
      setTimeout(() => onComplete(score), 300);
    } else {
      setRound((r) => r + 1);
    }
  };

  return (
    <TestLayout
      title="Attention Test"
      subtitle="Select the COLOR of the text (not the word)"
    >
      {/* WORD */}
      <h2
        className="text-center text-4xl font-bold"
        style={{ color: textColor }}
      >
        {word}
      </h2>

      {/* OPTIONS */}
      <div className="flex justify-center gap-3 mt-4">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            className="px-5 py-2 rounded-xl border hover:bg-slate-100 capitalize"
          >
            {c}
          </button>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="text-center text-sm text-slate-500 mt-2">
        Round {round + 1} / {maxRounds}
      </div>
    </TestLayout>
  );
}