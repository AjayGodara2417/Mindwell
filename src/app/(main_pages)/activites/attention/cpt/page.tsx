"use client";

import { useEffect, useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TOTAL_TRIALS = 20;

export default function CPTTest() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro");
  const [sequence, setSequence] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(0);

  // Generate sequence
  useEffect(() => {
    const seq = Array.from({ length: TOTAL_TRIALS }, () =>
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
    }, 1000);

    return () => clearTimeout(timer);
  }, [index, stage]);

  const handleClick = () => {
    if (index === 0) return;

    const prev = sequence[index - 1];
    const current = sequence[index];

    const isTarget = prev === "A" && current === "X";
    const reaction = Date.now() - startTime;

    setResponses((prevRes) => [
      ...prevRes,
      {
        type: isTarget ? "target" : "non-target",
        clicked: true,
        correct: isTarget,
        reaction,
      },
    ]);
  };

  const saveResult = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    let correct = 0;
    let totalTargets = 0;
    let falseAlarms = 0;

    responses.forEach((r) => {
      if (r.type === "target") totalTargets++;
      if (r.correct) correct++;
      if (!r.correct && r.clicked) falseAlarms++;
    });

    const accuracy = (correct / (totalTargets || 1)) * 100;

    const avgReaction =
      responses.reduce((a, b) => a + (b.reaction || 0), 0) /
      (responses.length || 1);

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "cpt",
        score: correct,
        accuracy,
        avg_reaction_time: Math.round(avgReaction),
      }),
    });
  };

  return (
    <div
      onClick={handleClick}
      className="min-h-screen flex items-center justify-center bg-[#f6f9f8] cursor-pointer"
    >
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-[350px]">

        {stage === "intro" && (
          <>
            <h1 className="text-xl font-bold text-[#2f5d50]">
              Continuous Performance Test
            </h1>

            <p className="text-gray-500 mt-3">
              Click ONLY when “X” appears after “A”.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {stage === "test" && (
          <>
            <h2 className="text-lg mb-4">Focus</h2>

            <div className="text-5xl font-bold">
              {sequence[index]}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Click only if rule matches
            </p>
          </>
        )}

        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-3 text-gray-600">
              Responses recorded successfully
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.reload();
              }}
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