"use client";

import { useEffect, useState } from "react";

export default function DigitSpanTest() {
  const [stage, setStage] = useState<
    "intro" | "countdown" | "show" | "input" | "result"
  >("intro");

  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState(3);
  const [maxLevel, setMaxLevel] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  const generateSequence = (length: number) =>
    Array.from({ length }, () => Math.floor(Math.random() * 9));

  const startTest = () => {
    setStage("countdown");

    setTimeout(() => {
      const seq = generateSequence(level);
      setSequence(seq);
      setStage("show");

      setTimeout(() => {
        setStage("input");
        setStartTime(Date.now());
      }, level * 800); // show time based on length
    }, 2000);
  };

  const handleSubmit = async () => {
    const endTime = Date.now();
    const reaction = endTime - startTime;

    const isCorrect = sequence.join("") === userInput;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setReactionTimes((prev) => [...prev, reaction]);

      const nextLevel = level + 1;
      setLevel(nextLevel);
      setMaxLevel(nextLevel);
      setAttempts(0);
      setUserInput("");

      const seq = generateSequence(nextLevel);
      setSequence(seq);
      setStage("show");

      setTimeout(() => {
        setStage("input");
        setStartTime(Date.now());
      }, nextLevel * 800);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setStage("result");
        await saveResult();
      } else {
        setUserInput("");
        setStage("show");

        setTimeout(() => {
          setStage("input");
          setStartTime(Date.now());
        }, level * 800);
      }
    }
  };

  const saveResult = async () => {
    const email = localStorage.getItem("userEmail");

    const avgReaction =
      reactionTimes.reduce((a, b) => a + b, 0) /
      (reactionTimes.length || 1);

    const accuracy =
      (correctCount / (correctCount + attempts || 1)) * 100;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "digit_span",
        score: maxLevel,
        accuracy,
        avg_reaction_time: Math.round(avgReaction),
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9f8] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        {stage === "intro" && (
          <>
            <h1 className="text-2xl font-bold text-[#2f5d50]">
              Digit Span Test
            </h1>
            <p className="text-gray-500 mt-3">
              A sequence of numbers will appear briefly. Memorize and repeat them.
            </p>

            <button
              onClick={startTest}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {stage === "countdown" && (
          <h2 className="text-xl font-semibold">Get Ready...</h2>
        )}

        {stage === "show" && (
          <div className="text-3xl tracking-widest font-mono">
            {sequence.join(" ")}
          </div>
        )}

        {stage === "input" && (
          <>
            <h2 className="text-lg font-semibold">
              Enter the sequence
            </h2>

            <input
              autoFocus
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="mt-4 w-full border rounded-lg p-2 text-center text-lg"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-[#2f5d50] text-white py-2 rounded-xl"
            >
              Submit
            </button>
          </>
        )}

        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Assessment Complete
            </h2>

            <p className="mt-3 text-gray-600">
              Max Span: {maxLevel}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Retake
            </button>
          </>
        )}
      </div>
    </div>
  );
}