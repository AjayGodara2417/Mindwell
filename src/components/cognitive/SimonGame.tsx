"use client";

import { useState, useRef, useEffect } from "react";
import TestLayout from "./TestLayout";
import { TestProps } from "@/types/cognitive";
import { motion } from "framer-motion";

const COLORS = ["green", "red", "yellow", "blue"] as const;
type ColorIndex = 0 | 1 | 2 | 3;

type Phase = "idle" | "playing" | "input" | "gameover";

export default function SimonGame({ onComplete }: TestProps) {
  const [sequence, setSequence] = useState<ColorIndex[]>([]);
  const [userInput, setUserInput] = useState<ColorIndex[]>([]);
  const [active, setActive] = useState<ColorIndex | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ▶️ Start Game
  const startGame = () => {
    cancelledRef.current = false;
    setSequence([]);
    setUserInput([]);
    setLevel(1);
    setPhase("playing");
    nextRound([]);
  };

  // 🔁 Next Round (safe state)
  const nextRound = (prev: ColorIndex[]) => {
    const next: ColorIndex[] = [
      ...prev,
      Math.floor(Math.random() * 4) as ColorIndex,
    ];

    setSequence(next);
    setUserInput([]);
    playSequence(next);
  };

  // 🎬 Play sequence safely
  const playSequence = async (seq: ColorIndex[]) => {
    setPhase("playing");

    for (let i = 0; i < seq.length; i++) {
      if (cancelledRef.current) return;

      setActive(seq[i]);
      await delay(500);

      setActive(null);
      await delay(250);
    }

    if (!cancelledRef.current) {
      setPhase("input");
    }
  };

  const delay = (ms: number) =>
    new Promise((res) => {
      timeoutRef.current = setTimeout(res, ms);
    });

  // 👆 Handle click
  const handleClick = (index: ColorIndex) => {
    if (phase !== "input") return;

    // Tap feedback
    setActive(index);
    setTimeout(() => setActive(null), 150);

    const newInput = [...userInput, index];
    setUserInput(newInput);

    // ❌ Wrong
    if (sequence[newInput.length - 1] !== index) {
      setPhase("gameover");

      const finalScore = calculateScore(level);

      setTimeout(() => {
        onComplete(finalScore);
      }, 800);

      return;
    }

    // ✅ Round complete
    if (newInput.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);

      setTimeout(() => {
        nextRound(sequence);
      }, 800);
    }
  };

  // 🧠 Better scoring model
  const calculateScore = (lvl: number) => {
    // nonlinear growth → better differentiation
    return Math.floor(lvl * lvl * 2);
  };

  return (
    <TestLayout title="Memory Test" subtitle="Repeat the pattern">
      <div className="relative flex flex-col items-center">
        {/* 🎮 BOARD */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900 rounded-3xl shadow-2xl">
          {COLORS.map((c, i) => (
            <motion.div
              key={i}
              onClick={() => handleClick(i as ColorIndex)}
              whileTap={{ scale: 0.92 }}
              animate={
                active === i
                  ? {
                      scale: 1.08,
                      opacity: 0.7,
                      boxShadow: "0 0 25px rgba(255,255,255,0.6)",
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.2 }}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl cursor-pointer
                ${c === "green" && "bg-green-500"}
                ${c === "red" && "bg-red-500"}
                ${c === "yellow" && "bg-yellow-400"}
                ${c === "blue" && "bg-blue-500"}
              `}
            />
          ))}
        </div>

        {/* ▶️ START */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-xl"
            >
              Start Game
            </motion.button>
          </div>
        )}

        {/* 📊 LEVEL */}
        {phase !== "idle" && (
          <div className="mt-4 text-white bg-slate-800 px-4 py-1 rounded-full text-sm shadow">
            Level {level}
          </div>
        )}

        {/* ❌ GAME OVER */}
        {phase === "gameover" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 text-red-500 font-semibold"
          >
            Game Over
          </motion.div>
        )}
      </div>
    </TestLayout>
  );
}