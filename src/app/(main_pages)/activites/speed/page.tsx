"use client";

import { useEffect, useState } from "react";

export default function ReactionTest() {
  const [stage, setStage] = useState<
    "intro" | "waiting" | "ready" | "result"
  >("intro");

  const [startTime, setStartTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [trial, setTrial] = useState(1);
  const [falseStarts, setFalseStarts] = useState(0);

  const TOTAL_TRIALS = 5;

  const startTest = () => {
    setStage("waiting");

    const delay = Math.random() * 3000 + 2000; // 2–5 sec

    setTimeout(() => {
      setStage("ready");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = async () => {
    if (stage === "waiting") {
      // ❌ clicked too early
      setFalseStarts((prev) => prev + 1);
      setStage("intro");
      return;
    }

    if (stage === "ready") {
      const reaction = Date.now() - startTime;

      const newTimes = [...times, reaction];
      setTimes(newTimes);

      if (trial < TOTAL_TRIALS) {
        setTrial((prev) => prev + 1);
        setStage("waiting");

        const delay = Math.random() * 3000 + 2000;

        setTimeout(() => {
          setStage("ready");
          setStartTime(Date.now());
        }, delay);
      } else {
        setStage("result");
        await saveResult(newTimes);
      }
    }
  };

  const saveResult = async (finalTimes: number[]) => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("User not logged in");
      return;
    }

    const avg =
      finalTimes.reduce((a, b) => a + b, 0) /
      finalTimes.length;

    const accuracy =
      ((TOTAL_TRIALS - falseStarts) / TOTAL_TRIALS) * 100;

    await fetch("/api/save-cognitive-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        test_type: "reaction_time",
        score: Math.round(avg), // lower = better
        accuracy,
        avg_reaction_time: Math.round(avg),
      }),
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`min-h-screen flex items-center justify-center cursor-pointer ${
        stage === "ready" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">

        {stage === "intro" && (
          <>
            <h1 className="text-2xl font-bold text-[#2f5d50]">
              Reaction Time Test
            </h1>
            <p className="text-gray-500 mt-3">
              Click as soon as the screen turns green.
              Do not click before!
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

        {stage === "waiting" && (
          <h2 className="text-lg">Wait for green...</h2>
        )}

        {stage === "ready" && (
          <h2 className="text-lg text-white">
            CLICK NOW!
          </h2>
        )}

        {stage === "result" && (
          <>
            <h2 className="text-xl font-bold text-[#2f5d50]">
              Test Complete
            </h2>

            <p className="mt-3 text-gray-600">
              Avg Reaction Time:{" "}
              <span className="font-semibold">
                {Math.round(
                  times.reduce((a, b) => a + b, 0) / times.length
                )}{" "}
                ms
              </span>
            </p>

            <p className="text-gray-500 mt-1">
              False Starts: {falseStarts}
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