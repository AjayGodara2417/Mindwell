"use client";

import { useState } from "react";
import TestLayout from "./TestLayout";
import { TestProps } from "@/types/cognitive";

const colors = ["green", "red", "yellow", "blue"];

export default function SimonGame({ onComplete }: TestProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // ▶️ Start Game
  const startGame = () => {
    setStarted(true);
    setSequence([]);
    setUserInput([]);
    setLevel(1);
    setGameOver(false);
    nextRound([]);
  };

  // 🔁 Next Round
  const nextRound = (prev: number[]) => {
    const next = [...prev, Math.floor(Math.random() * 4)];
    setSequence(next);
    setUserInput([]);
    playSequence(next);
  };

  // 🎬 Show sequence
  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);

    for (let i = 0; i < seq.length; i++) {
      setActive(seq[i]);
      await new Promise((r) => setTimeout(r, 500));
      setActive(null);
      await new Promise((r) => setTimeout(r, 250));
    }

    setIsPlaying(false);
  };

  // 👆 Handle click
  const handleClick = (index: number) => {
    if (isPlaying || gameOver) return;

    const newInput = [...userInput, index];
    setUserInput(newInput);

    // ❌ Wrong input
    if (sequence[newInput.length - 1] !== index) {
      setGameOver(true);

      // send score after small delay (UX)
      setTimeout(() => {
        onComplete(level * 5);
      }, 800);

      return;
    }

    // ✅ Round complete
    if (newInput.length === sequence.length) {
      setLevel((l) => l + 1);
      setTimeout(() => nextRound(sequence), 800);
    }
  };

  return (
    <TestLayout
      title="Memory Test"
      subtitle="Repeat the pattern"
    >
      {/* START BUTTON */}
      {!started && (
        <div className="text-center">
          <button onClick={startGame} className="btn">
            Start Game
          </button>
        </div>
      )}

      {/* GAME GRID */}
      {started && (
        <>
          <div className="grid grid-cols-2 gap-4 justify-center">
            {colors.map((c, i) => (
              <div
                key={i}
                onClick={() => handleClick(i)}
                className={`w-28 h-28 rounded-2xl cursor-pointer shadow-md transition-all
                  ${c === "green" && "bg-green-500"}
                  ${c === "red" && "bg-red-500"}
                  ${c === "yellow" && "bg-yellow-400"}
                  ${c === "blue" && "bg-blue-500"}
                  ${active === i && "opacity-60 scale-110"}
                `}
              />
            ))}
          </div>

          <div className="text-center text-slate-600 mt-2">
            Level: {level}
          </div>
        </>
      )}

      {gameOver && (
        <div className="text-center text-red-500 font-medium mt-4">
          Game Over
        </div>
      )}
    </TestLayout>
  );
}