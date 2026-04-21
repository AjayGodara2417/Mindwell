"use client";

import { useState } from "react";

const WORDS = [
  { word: "happy", type: "positive" },
  { word: "success", type: "positive" },
  { word: "joy", type: "positive" },

  { word: "failure", type: "negative" },
  { word: "sad", type: "negative" },
  { word: "hopeless", type: "negative" },

  { word: "table", type: "neutral" },
  { word: "chair", type: "neutral" },
  { word: "window", type: "neutral" },
];

export default function NegativeBiasRecall() {
  const [stage, setStage] = useState<
    "intro" | "show" | "delay" | "recall" | "result"
  >("intro");

  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const startTest = () => {
    setStage("show");

    // Show words for 5 sec
    setTimeout(() => {
      setStage("delay");

      // Delay phase (5 sec)
      setTimeout(() => {
        setStage("recall");
      }, 5000);
    }, 5000);
  };

  const handleSubmit = async () => {
    const userWords = input
      .toLowerCase()
      .split(",")
      .map((w) => w.trim());

    let total = 0;
    let positive = 0;
    let negative = 0;

    WORDS.forEach((w) => {
      if (userWords.includes(w.word)) {
        total++;
        if (w.type === "positive") positive++;
        if (w.type === "negative") negative++;
      }
    });

    const biasIndex = negative - positive;

    const resultData = {
      total,
      positive,
      negative,
      biasIndex,
    };

    setResult(resultData);
    setStage("result");

    await saveResult(resultData);
  };

  const saveResult = async (data: any) => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const accuracy = (data.total / WORDS.length) * 100;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "negative_bias_recall",
        score: data.total,
        accuracy,
        avg_reaction_time: 0,
        bias_score: data.biasIndex, // 🔥 key metric
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
              Memory Bias Test
            </h1>

            <p className="text-gray-500 mt-3">
              Try to remember the words shown.
            </p>

            <button
              onClick={startTest}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {/* SHOW */}
        {stage === "show" && (
          <>
            <h2 className="mb-4">Memorize these words</h2>

            <div className="grid grid-cols-3 gap-2">
              {WORDS.map((w) => (
                <div key={w.word} className="bg-gray-100 p-2 rounded">
                  {w.word}
                </div>
              ))}
            </div>
          </>
        )}

        {/* DELAY */}
        {stage === "delay" && (
          <h2>Please wait...</h2>
        )}

        {/* RECALL */}
        {stage === "recall" && (
          <>
            <h2 className="mb-2">Enter words you remember</h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Submit
            </button>
          </>
        )}

        {/* RESULT */}
        {stage === "result" && result && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-2">
              Total Recall: {result.total}
            </p>
            <p>Positive: {result.positive}</p>
            <p>Negative: {result.negative}</p>

            <p className="mt-2 font-semibold">
              Bias Score: {result.biasIndex}
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