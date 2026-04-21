"use client";

import { useEffect, useState } from "react";

const SYMBOLS = ["★", "●", "▲", "■", "◆", "⬟"];
const TOTAL_TRIALS = 12;

export default function SymbolDigitTest() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [trial, setTrial] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(0);

  // Generate random mapping
  useEffect(() => {
    const shuffled = [...SYMBOLS].sort(() => Math.random() - 0.5);
    const map: Record<string, number> = {};
    shuffled.slice(0, 4).forEach((sym, i) => {
      map[sym] = i + 1;
    });
    setMapping(map);
  }, []);

  const startTest = () => {
    setStage("test");
    nextTrial();
  };

  const nextTrial = () => {
    const symbols = Object.keys(mapping);
    const randomSymbol =
      symbols[Math.floor(Math.random() * symbols.length)];

    setCurrentSymbol(randomSymbol);
    setStartTime(Date.now());
  };

  const handleAnswer = async (num: number) => {
    const correct = mapping[currentSymbol] === num;
    const reaction = Date.now() - startTime;

    const newResponses = [
      ...responses,
      { correct, reaction },
    ];

    setResponses(newResponses);

    if (trial + 1 < TOTAL_TRIALS) {
      setTrial((prev) => prev + 1);
      nextTrial();
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

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "symbol_digit",
        score: correct,
        accuracy,
        avg_reaction_time: Math.round(avgReaction),
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
              Symbol-Digit Test
            </h1>

            <p className="text-gray-500 mt-3">
              Match each symbol to its correct number as quickly as possible.
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
            <h2 className="mb-4 font-semibold">Mapping</h2>

            <div className="flex justify-center gap-4 mb-6">
              {Object.entries(mapping).map(([sym, num]) => (
                <div key={sym} className="text-center">
                  <div className="text-2xl">{sym}</div>
                  <div className="text-sm text-gray-500">{num}</div>
                </div>
              ))}
            </div>

            <div className="text-5xl mb-6">{currentSymbol}</div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => handleAnswer(n)}
                  className="bg-[#2f5d50] text-white py-2 rounded-xl"
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Trial {trial + 1} / {TOTAL_TRIALS}
            </p>
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