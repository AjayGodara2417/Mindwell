"use client";

import TestLayout from "./TestLayout";
import { useState, useEffect } from "react";
import { TestProps } from "@/types/cognitive";
import { motion } from "framer-motion";

const COLORS = ["red", "blue", "green"] as const;
type ColorType = (typeof COLORS)[number];

interface Stimulus {
  word: ColorType;
  color: ColorType;
}

export default function StroopTest({ onComplete }: TestProps) {
  const MAX_ROUNDS = 5;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [locked, setLocked] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Generate stable stimulus
  const generateStimulus = (): Stimulus => {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return { word, color };
  };

  // Initialize + next round trigger
  useEffect(() => {
    if (round < MAX_ROUNDS) {
      const s = generateStimulus();
      setStimulus(s);
      setLocked(false);
      setStartTime(Date.now());
    }
  }, [round]);

  const handleAnswer = (selected: ColorType) => {
    if (!stimulus || locked) return;

    setLocked(true);

    const reactionTime = Date.now() - startTime;
    const isCorrect = selected === stimulus.color;

    let newScore = score;

    if (isCorrect) {
      // Combine speed + accuracy
      const speedBonus =
        reactionTime < 400 ? 3 : reactionTime < 800 ? 2 : 1;
      newScore += 2 + speedBonus;
    }

    setReactionTimes((prev) => [...prev, reactionTime]);
    setScore(newScore);

    setTimeout(() => {
      if (round + 1 >= MAX_ROUNDS) {
        onComplete(newScore);
      } else {
        setRound((r) => r + 1);
      }
    }, 400);
  };

  if (!stimulus) return null;

  return (
    <TestLayout
      title="Stroop Test"
      subtitle="Select the TEXT color, not the word"
    >
      {/* STIMULUS */}
      <motion.h2
        key={stimulus.word + stimulus.color + round}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-4xl font-bold"
        style={{ color: stimulus.color }}
      >
        {stimulus.word.toUpperCase()}
      </motion.h2>

      {/* OPTIONS */}
      <div className="flex justify-center gap-3 mt-6">
        {COLORS.map((c) => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            disabled={locked}
            onClick={() => handleAnswer(c)}
            className={`px-4 py-2 rounded-xl border shadow-sm capitalize transition
              ${
                locked
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-100"
              }`}
          >
            {c}
          </motion.button>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="text-center text-sm text-slate-500 mt-4">
        Round {round + 1} / {MAX_ROUNDS}
      </div>
    </TestLayout>
  );
}