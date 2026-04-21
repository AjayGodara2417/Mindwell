"use client";

import { useEffect, useState } from "react";

const COLORS = ["red", "blue", "green", "yellow"];

export default function VisualMemoryTest() {
  const [stage, setStage] = useState<
    "intro" | "show" | "input" | "result"
  >("intro");

  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);

  const generateNext = (prev: string[]) => {
    return [...prev, COLORS[Math.floor(Math.random() * COLORS.length)]];
  };

  const startTest = () => {
    const first = generateNext([]);
    setSequence(first);
    setStage("show");
  };

  useEffect(() => {
    if (stage === "show") {
      let i = 0;

      const interval = setInterval(() => {
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setStage("input");
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [stage, sequence]);

  const handleClick = async (color: string) => {
    const newInput = [...userSequence, color];
    setUserSequence(newInput);

    const index = newInput.length - 1;

    if (sequence[index] !== color) {
      setStage("result");
      await saveResult();
      return;
    }

    if (newInput.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setMaxLevel(nextLevel);

      const nextSeq = generateNext(sequence);
      setSequence(nextSeq);
      setUserSequence([]);
      setStage("show");
    }
  };

  const saveResult = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "visual_memory",
        score: maxLevel,
        accuracy: 100,
        avg_reaction_time: 0,
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9f8]">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-[350px]">

        {stage === "intro" && (
          <>
            <h1 className="text-xl font-bold text-[#2f5d50]">
              Visual Memory Test
            </h1>

            <button
              onClick={startTest}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start
            </button>
          </>
        )}

        {stage === "show" && (
          <p className="text-gray-500">Memorize the sequence...</p>
        )}

        {stage === "input" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => handleClick(c)}
                className="h-16 rounded-xl"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {stage === "result" && (
          <>
            <h2 className="text-lg font-bold">Result</h2>
            <p>Max Level: {maxLevel}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#2f5d50] text-white px-4 py-2 rounded-xl"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}