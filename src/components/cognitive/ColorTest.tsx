"use client";

import { useEffect, useState } from "react";
import TestLayout from "./TestLayout";
import { TestProps } from "@/types/cognitive";
import { motion } from "framer-motion";

const WORDS = ["RED", "BLUE", "GREEN"] as const;
const COLORS = ["red", "blue", "green"] as const;

type ColorType = (typeof COLORS)[number];

interface RoundData {
  word: string;
  color: ColorType;
}

export default function ColorTest({ onComplete }: TestProps) {
  const maxRounds = 5;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<RoundData | null>(null);
  const [locked, setLocked] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Generate new round safely
  const generateRound = (): RoundData => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return { word, color };
  };

  // Initialize first round
  useEffect(() => {
    setCurrent(generateRound());
    setStartTime(Date.now());
  }, []);

  const handleAnswer = (selected: ColorType) => {
    if (!current || locked) return;

    setLocked(true);

    const isCorrect = selected === current.color;

    // Reaction time (useful for cognitive scoring later)
    const reactionTime = Date.now() - startTime;

    let newScore = score;

    if (isCorrect) {
      // You can tweak scoring logic
      newScore += 2;
      setScore(newScore);
    }

    // Small delay for UX feedback
    setTimeout(() => {
      if (round + 1 >= maxRounds) {
        onComplete(newScore); // ✅ FIXED stale state issue
      } else {
        setRound((r) => r + 1);
        setCurrent(generateRound());
        setLocked(false);
        setStartTime(Date.now());
      }
    }, 500);
  };

  if (!current) return null;

  return (
    <TestLayout
      title="Attention Test"
      subtitle="Select the COLOR of the text (not the word)"
    >
      {/* WORD */}
      <motion.h2
        key={current.word + current.color}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-4xl font-bold"
        style={{ color: current.color }}
      >
        {current.word}
      </motion.h2>

      {/* OPTIONS */}
      <div className="flex justify-center gap-3 mt-6">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            disabled={locked}
            className={`px-5 py-2 rounded-xl border capitalize transition
              ${
                locked
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-100"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="text-center text-sm text-slate-500 mt-4">
        Round {round + 1} / {maxRounds}
      </div>
    </TestLayout>
  );
}