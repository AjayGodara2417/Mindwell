"use client";

import { useEffect, useState } from "react";

const words = ["RED", "BLUE", "GREEN", "YELLOW"];
const colors = ["red", "blue", "green", "yellow"];

export default function StroopTest() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [trials, setTrials] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);

  // Generate trials
  useEffect(() => {
    const generated = Array.from({ length: 10 }).map(() => {
      const word = words[Math.floor(Math.random() * words.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return { word, color };
    });

    setTrials(generated);
  }, []);

  const startTest = () => {
    setStage("test");
    setStartTime(Date.now());
  };

  const handleAnswer = async (selectedColor: string) => {
    const trial = trials[current];
    const reaction = Date.now() - startTime;

    const isCorrect = selectedColor === trial.color;

    setResponses((prev) => [
      ...prev,
      { isCorrect, reaction },
    ]);

    if (current + 1 < trials.length) {
      setCurrent((prev) => prev + 1);
      setStartTime(Date.now());
    } else {
      setStage("result");
      await saveResult([...responses, { isCorrect, reaction }]);
    }
  };

  const saveResult = async (finalResponses: any[]) => {
    const email = localStorage.getItem("userEmail");

    const correct = finalResponses.filter((r) => r.isCorrect).length;

    const accuracy = (correct / finalResponses.length) * 100;

    const avgReaction =
      finalResponses.reduce((a, b) => a + b.reaction, 0) /
      finalResponses.length;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "stroop",
        score: correct,
        accuracy,
        avg_reaction_time: Math.round(avgReaction),
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9f8] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        {/* INTRO */}
        {stage === "intro" && (
          <>
            <h1 className="text-2xl font-bold text-[#2f5d50]">
              Stroop Test
            </h1>
            <p className="text-gray-500 mt-3">
              Select the COLOR of the word, not the word itself.
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
        {stage === "test" && trials[current] && (
          <>
            <h2 className="text-lg mb-4">Choose the color</h2>

            <div
              className="text-3xl font-bold mb-6"
              style={{ color: trials[current].color }}
            >
              {trials[current].word}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleAnswer(c)}
                  className="py-2 rounded-xl text-white capitalize"
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
              Responses recorded successfully.
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