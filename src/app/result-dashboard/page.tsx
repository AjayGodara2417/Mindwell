"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {

  const params = useSearchParams();
  const score = Number(params.get("score"));

  const getResult = () => {

    if (score <= 10) {
      return {
        level: "Minimal",
        color: "green",
        message: "You show minimal signs of depression.",
      };
    }

    if (score <= 20) {
      return {
        level: "Mild",
        color: "yellow",
        message: "You may be experiencing mild depressive symptoms.",
      };
    }

    if (score <= 40) {
      return {
        level: "Moderate",
        color: "orange",
        message: "You may be experiencing moderate depression.",
      };
    }

    return {
      level: "Severe",
      color: "red",
      message:
        "Your responses indicate severe depressive symptoms. Consider seeking professional help.",
    };
  };

  const result = getResult();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1623] text-white">

      <div className="w-130 bg-[#0f2438] border border-white/10 rounded-2xl p-10 text-center shadow-xl">

        <h1 className="text-3xl font-bold mb-6">
          Your Mental Health Result
        </h1>

        <div className={`text-5xl font-bold mb-4 text-${result.color}-400`}>
          {score}
        </div>

        <div className="text-xl font-semibold mb-3">
          {result.level} Depression
        </div>

        <p className="text-gray-300 mb-8">
          {result.message}
        </p>

      </div>

    </div>
  );
}