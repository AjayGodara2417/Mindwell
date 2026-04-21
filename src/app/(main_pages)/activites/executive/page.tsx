"use client";

import { useEffect, useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function NBackTest() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [sequence, setSequence] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(0);

  const N = 2;
  const TOTAL = 15;

  // Generate sequence
  useEffect(() => {
    const seq = Array.from({ length: TOTAL }, () =>
      LETTERS[Math.floor(Math.random() * LETTERS.length)]
    );
    setSequence(seq);
  }, []);

  const startTest = () => {
    setStage("test");
    setIndex(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (stage !== "test") return;

    if (index >= sequence.length) {
      setStage("result");
      saveResult();
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
      setStartTime(Date.now());
    }, 1500);

    return () => clearTimeout(timer);
  }, [index, stage]);

  const handleResponse = (isMatchClicked: boolean) => {
    if (index < N) return;

    const actualMatch =
      sequence[index] === sequence[index - N];

    const reaction = Date.now() - startTime;

    setResponses((prev) => [
      ...prev,
      {
        correct: isMatchClicked === actualMatch,
        reaction,
      },
    ]);
  };

  const saveResult = async () => {
    const email = localStorage.getItem("userEmail");

    if (!email) return;

    const correct = responses.filter((r) => r.correct).length;

    const accuracy = (correct / responses.length) * 100;

    const avgReaction =
      responses.reduce((a, b) => a + b.reaction, 0) /
      (responses.length || 1);

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "n_back",
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
              N-Back Test (2-Back)
            </h1>

            <p className="text-gray-500 mt-3">
              Click \"Match\" if the current letter matches the one shown 2 steps before.
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
        {stage === "test" && (
          <>
            <h2 className="text-lg mb-4">Trial {index + 1}</h2>

            <div className="text-5xl font-bold mb-6">
              {sequence[index]}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleResponse(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Match
              </button>

              <button
                onClick={() => handleResponse(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-xl"
              >
                No Match
              </button>
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
              Responses recorded successfully
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