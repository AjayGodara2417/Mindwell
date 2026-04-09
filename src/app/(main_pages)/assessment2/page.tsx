"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const colors = ["green", "red", "yellow", "blue"];

function SimonGameInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseScore = Number(searchParams.get("score")) || 0;

  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setSequence([]);
    setUserInput([]);
    setLevel(1);
    setGameOver(false);
    nextRound([]);
  };

  const nextRound = (prevSeq: number[]) => {
    const next = [...prevSeq, Math.floor(Math.random() * 4)];
    setSequence(next);
    setUserInput([]);
    playSequence(next);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);

    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise((res) => setTimeout(res, 500));
      setActiveIndex(null);
      await new Promise((res) => setTimeout(res, 250));
    }

    setIsPlaying(false);
  };

  const handleClick = (index: number) => {
    if (isPlaying || gameOver) return;

    const newInput = [...userInput, index];
    setUserInput(newInput);

    if (sequence[newInput.length - 1] !== index) {
      setGameOver(true);
      return;
    }

    if (newInput.length === sequence.length) {
      setLevel((prev) => prev + 1);
      setTimeout(() => nextRound(sequence), 800);
    }
  };

  useEffect(() => {
  if (gameOver) {
    router.push(`/assessment3?score=${baseScore}&memoryLevel=${level}`);
  }
}, [gameOver]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Memory Test
        </h1>
        <p className="text-slate-500 mt-1">
          Repeat the sequence correctly
        </p>
      </div>

      <div className="flex gap-6 mb-6 text-sm text-slate-600">
        <span>Level: {level}</span>
        <span>Base Score: {baseScore}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            onClick={() => handleClick(index)}
            animate={{
              scale: activeIndex === index ? 1.1 : 1,
              opacity: activeIndex === index ? 0.7 : 1,
            }}
            className={`w-32 h-32 rounded-xl cursor-pointer shadow-md
              ${color === "green" && "bg-green-500"}
              ${color === "red" && "bg-red-500"}
              ${color === "yellow" && "bg-yellow-400"}
              ${color === "blue" && "bg-blue-500"}
            `}
          />
        ))}
      </div>

      {!sequence.length && !gameOver && (
        <button
          onClick={startGame}
          className="mt-8 bg-teal-500 text-white px-6 py-3 rounded-xl shadow hover:bg-teal-600"
        >
          Start Game
        </button>
      )}

      {gameOver && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-red-500">
            Game Over
          </h2>
          <p className="text-slate-500 mt-2">
            Redirecting to results...
          </p>
        </div>
      )}
    </div>
  );
}

export default function SimonGame() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimonGameInner />
    </Suspense>
  );
}