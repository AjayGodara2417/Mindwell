"use client";

import { useEffect, useState } from "react";

const COLORS = ["red", "blue", "green", "yellow"];

const WORDS = [
  { text: "failure", type: "negative" },
  { text: "sad", type: "negative" },
  { text: "hopeless", type: "negative" },

  { text: "table", type: "neutral" },
  { text: "chair", type: "neutral" },

  { text: "happy", type: "positive" },
  { text: "success", type: "positive" },
];

const TOTAL_TRIALS = 12;

export default function EmotionalStroop() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [trials, setTrials] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: TOTAL_TRIALS }).map(() => {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return { ...word, color };
    });

    setTrials(generated);
  }, []);

  const startTest = () => {
    setStage("test");
    setStartTime(Date.now());
  };

  const handleAnswer = async (selectedColor: string) => {
    const trial = trials[index];
    const reaction = Date.now() - startTime;

    const correct = selectedColor === trial.color;

    const newResponses = [
      ...responses,
      {
        correct,
        reaction,
        type: trial.type,
      },
    ];

    setResponses(newResponses);

    if (index + 1 < TOTAL_TRIALS) {
      setIndex((prev) => prev + 1);
      setStartTime(Date.now());
    } else {
      setStage("result");
      await saveResult(newResponses);
    }
  };

  const saveResult = async (finalResponses: any[]) => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const correct = finalResponses.filter((r) => r.correct).length;

    const accuracy = (correct / finalResponses.length) * 100;

    const avgReaction =
      finalResponses.reduce((a, b) => a + b.reaction, 0) /
      finalResponses.length;

    // 🔥 Emotional bias calculation
    const negativeRT =
      finalResponses
        .filter((r) => r.type === "negative")
        .reduce((a, b) => a + b.reaction, 0) /
      (finalResponses.filter((r) => r.type === "negative").length || 1);

    const neutralRT =
      finalResponses
        .filter((r) => r.type === "neutral")
        .reduce((a, b) => a + b.reaction, 0) /
      (finalResponses.filter((r) => r.type === "neutral").length || 1);

    const biasScore = negativeRT - neutralRT;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "emotional_stroop",
        score: correct,
        accuracy,
        avg_reaction_time: Math.round(avgReaction),
        bias_score: Math.round(biasScore), // 🔥 extra insight
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9f8] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] text-center">

        {/* INTRO */}
        {stage === "intro" && (
          <>
            <h1 className="text-xl font-bold text-[#2f5d50]">
              Emotional Stroop Test
            </h1>

            <p className="text-gray-500 mt-3">
              Select the COLOR of the word, ignore its meaning.
            </p>

            <button
              onClick={startTest}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {/* TEST */}
        {stage === "test" && trials[index] && (
          <>
            <h2 className="mb-4">Choose the color</h2>

            <div
              className="text-3xl font-bold mb-6"
              style={{ color: trials[index].color }}
            >
              {trials[index].text}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleAnswer(c)}
                  className="py-2 rounded-xl text-white"
                  style={{ backgroundColor: c }}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {/* RESULT */}
        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-3 text-gray-600">
              Emotional response recorded
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