"use client";

import { useEffect, useState } from "react";

const WORD_POOL = [
  "apple", "table", "river", "chair", "music",
  "cloud", "green", "house", "light", "stone",
  "paper", "water", "dream", "plant", "glass",
];

export default function WordRecallTest() {
  const [stage, setStage] = useState<
    "intro" | "show" | "delay" | "recall" | "result"
  >("intro");

  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);

  // Generate random words
  const generateWords = () => {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const startTest = () => {
    const selected = generateWords();
    setWords(selected);
    setStage("show");

    // Show words for 5 sec
    setTimeout(() => {
      setStage("delay");

      // 5 sec delay (distraction phase)
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

    const correct = words.filter((w) =>
      userWords.includes(w)
    );

    const finalScore = correct.length;
    setScore(finalScore);
    setStage("result");

    await saveResult(finalScore);
  };

  const saveResult = async (finalScore: number) => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("User not logged in");
      return;
    }

    const accuracy = (finalScore / words.length) * 100;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "word_recall",
        score: finalScore,
        accuracy,
        avg_reaction_time: 0, // not needed here
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
              Word Recall Test
            </h1>
            <p className="text-gray-500 mt-3">
              You will see a list of words. Try to remember them.
            </p>

            <button
              onClick={startTest}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {/* SHOW WORDS */}
        {stage === "show" && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Memorize these words
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {words.map((w, i) => (
                <div
                  key={i}
                  className="bg-gray-100 py-2 rounded-lg"
                >
                  {w}
                </div>
              ))}
            </div>
          </>
        )}

        {/* DELAY */}
        {stage === "delay" && (
          <h2 className="text-lg">
            Please wait...
          </h2>
        )}

        {/* RECALL */}
        {stage === "recall" && (
          <>
            <h2 className="text-lg font-semibold">
              Enter the words you remember
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Separate by commas
            </p>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-4 w-full border rounded-lg p-2"
              rows={3}
            />

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-[#2f5d50] text-white py-2 rounded-xl"
            >
              Submit
            </button>
          </>
        )}

        {/* RESULT */}
        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-3 text-gray-600">
              You recalled{" "}
              <span className="font-semibold">
                {score}
              </span>{" "}
              out of {words.length} words
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