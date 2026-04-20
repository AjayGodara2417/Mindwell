"use client";

import TestLayout from "./TestLayout";
import { useState, useEffect, useRef } from "react";
import { TestProps } from "@/types/cognitive";
import { motion } from "framer-motion";

type Phase = "waiting" | "ready" | "clicked";

export default function ReactionTest({ onComplete }: TestProps) {
  const TOTAL_ROUNDS = 5;

  const [phase, setPhase] = useState<Phase>("waiting");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const startRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new round
  const startRound = () => {
    setPhase("waiting");
    setLocked(false);

    const delay = Math.random() * 3000 + 2000;

    timeoutRef.current = setTimeout(() => {
      setPhase("ready");
      startRef.current = Date.now();
    }, delay);
  };

  // Initialize
  useEffect(() => {
    startRound();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (locked) return;

    // ❌ False start
    if (phase === "waiting") {
      setLocked(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Penalize heavily
      setTimeout(() => {
        onComplete(0);
      }, 500);

      return;
    }

    // ✅ Valid click
    if (phase === "ready" && startRef.current) {
      const reactionTime = Date.now() - startRef.current;

      setPhase("clicked");
      setLocked(true);

      const newTimes = [...times, reactionTime];
      setTimes(newTimes);

      setTimeout(() => {
        if (round + 1 >= TOTAL_ROUNDS) {
          // Final scoring based on average reaction time
          const avg =
            newTimes.reduce((a, b) => a + b, 0) / newTimes.length;

          let score = 0;
          if (avg < 250) score = 10;
          else if (avg < 400) score = 7;
          else if (avg < 600) score = 5;
          else score = 2;

          onComplete(score);
        } else {
          setRound((r) => r + 1);
          startRound();
        }
      }, 800);
    }
  };

  return (
    <TestLayout
      title="Reaction Test"
      subtitle={
        phase === "waiting"
          ? "Wait for green..."
          : phase === "ready"
          ? "CLICK NOW!"
          : "Good!"
      }
    >
      <motion.div
        onClick={handleClick}
        animate={{
          scale: phase === "ready" ? 1.05 : 1,
        }}
        transition={{
          repeat: phase === "waiting" ? Infinity : 0,
          duration: 0.8,
        }}
        className={`h-40 rounded-2xl flex items-center justify-center text-white text-xl cursor-pointer shadow-xl select-none
          ${
            phase === "waiting"
              ? "bg-red-500"
              : phase === "ready"
              ? "bg-green-500"
              : "bg-blue-500"
          }
        `}
      >
        {phase === "waiting"
          ? "Wait..."
          : phase === "ready"
          ? "CLICK!"
          : "Recorded"}
      </motion.div>

      {/* PROGRESS */}
      <div className="text-center text-sm text-slate-500 mt-4">
        Round {round + 1} / {TOTAL_ROUNDS}
      </div>
    </TestLayout>
  );
}