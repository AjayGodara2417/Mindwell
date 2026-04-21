"use client";

import { useEffect, useState } from "react";

const generatePartA = () => {
  return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
};

const generatePartB = () => {
  const nums = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
  const letters = ["A", "B", "C", "D", "E"];

  const result: string[] = [];
  for (let i = 0; i < 5; i++) {
    result.push(nums[i]);
    result.push(letters[i]);
  }
  return result;
};

export default function TrailMakingTest() {
  const [stage, setStage] = useState<"intro" | "A" | "B" | "result">("intro");
  const [items, setItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [times, setTimes] = useState<{ A?: number; B?: number }>({});
  const [errors, setErrors] = useState(0);

  // Shuffle grid positions
  const shuffle = (arr: string[]) =>
    [...arr].sort(() => Math.random() - 0.5);

  const startPartA = () => {
    setItems(shuffle(generatePartA()));
    setStage("A");
    setCurrentIndex(0);
    setStartTime(Date.now());
  };

  const startPartB = () => {
    setItems(shuffle(generatePartB()));
    setStage("B");
    setCurrentIndex(0);
    setStartTime(Date.now());
  };

  const handleClick = (value: string) => {
    const correctSequence =
      stage === "A" ? generatePartA() : generatePartB();

    const expected = correctSequence[currentIndex];

    if (value === expected) {
      if (currentIndex + 1 === correctSequence.length) {
        const timeTaken = Date.now() - startTime;

        if (stage === "A") {
          setTimes((prev) => ({ ...prev, A: timeTaken }));
          startPartB();
        } else {
          setTimes((prev) => ({ ...prev, B: timeTaken }));
          setStage("result");
          saveResult({ ...times, B: timeTaken });
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      setErrors((prev) => prev + 1);
    }
  };

  const saveResult = async (finalTimes: any) => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const totalTime = (finalTimes.A || 0) + (finalTimes.B || 0);

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "trail_making",
        score: totalTime, // lower is better
        accuracy: Math.max(0, 100 - errors * 5),
        avg_reaction_time: totalTime,
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9f8] p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md w-[400px] text-center">

        {stage === "intro" && (
          <>
            <h1 className="text-xl font-bold text-[#2f5d50]">
              Trail Making Test
            </h1>

            <p className="text-gray-500 mt-2">
              Connect items in order as fast as possible.
            </p>

            <button
              onClick={startPartA}
              className="mt-6 bg-[#2f5d50] text-white px-6 py-2 rounded-xl"
            >
              Start Test
            </button>
          </>
        )}

        {(stage === "A" || stage === "B") && (
          <>
            <h2 className="mb-4 font-semibold">
              Part {stage} — Step {currentIndex + 1}
            </h2>

            <div className="grid grid-cols-5 gap-3">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className="bg-gray-100 py-3 rounded-lg hover:bg-[#e8f3f1]"
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Errors: {errors}
            </p>
          </>
        )}

        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-2 text-gray-600">
              Time A: {times.A} ms
            </p>
            <p className="text-gray-600">
              Time B: {times.B} ms
            </p>

            <p className="text-gray-500 mt-2">
              Errors: {errors}
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