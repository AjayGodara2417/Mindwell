"use client";

import TestLayout from "./TestLayout";
import { useState, useEffect } from "react";
import { TestProps } from "@/types/cognitive";
import { motion } from "framer-motion";

type Phase = "show" | "input";

export default function DigitSpanTest({ onComplete }: TestProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [length, setLength] = useState(3);
  const [phase, setPhase] = useState<Phase>("show");
  const [locked, setLocked] = useState(false);

  const DISPLAY_TIME = 1500; // ms

  // Generate sequence
  const generateSequence = (len: number) => {
    return Array.from({ length: len }, () =>
      Math.floor(Math.random() * 10)
    );
  };

  // Start new round
  useEffect(() => {
    const seq = generateSequence(length);
    setSequence(seq);
    setPhase("show");
    setInput("");
    setLocked(true);

    const timer = setTimeout(() => {
      setPhase("input");
      setLocked(false);
    }, DISPLAY_TIME + length * 300); // slightly longer for bigger sequences

    return () => clearTimeout(timer);
  }, [length]);

  const handleSubmit = () => {
    if (locked) return;

    setLocked(true);

    const isCorrect = input === sequence.join("");

    setTimeout(() => {
      if (isCorrect) {
        setLength((l) => l + 1); // increase difficulty
      } else {
        // Final score = highest length reached
        onComplete(length * 2);
      }
    }, 300);
  };

  return (
    <TestLayout
      title="Memory Recall"
      subtitle={
        phase === "show"
          ? "Memorize the numbers"
          : "Enter the sequence"
      }
    >
      {/* SEQUENCE DISPLAY */}
      <motion.h2
        key={sequence.join("") + phase}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-3xl font-bold tracking-widest min-h-[48px]"
      >
        {phase === "show" ? sequence.join(" ") : "••••••"}
      </motion.h2>

      {/* INPUT */}
      {phase === "input" && (
        <input
          value={input}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only digits
            setInput(value);
          }}
          maxLength={length}
          disabled={locked}
          placeholder="Enter numbers"
          className="w-full p-3 border rounded-xl text-center text-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      )}

      {/* BUTTON */}
      {phase === "input" && (
        <button
          onClick={handleSubmit}
          disabled={locked || input.length !== length}
          className={`btn w-full mt-2 ${
            locked || input.length !== length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Submit
        </button>
      )}

      {/* PROGRESS */}
      <div className="text-center text-sm text-slate-500 mt-4">
        Current Length: {length}
      </div>
    </TestLayout>
  );
}