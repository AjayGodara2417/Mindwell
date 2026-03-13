"use client";

import { useSearchParams } from "next/navigation";

export default function ResultDashboard() {

  const params = useSearchParams();

  const score = Number(params.get("score")) || 0;

  const percentage = Math.round((score / 75) * 100);

  let level = "";
  let color = "";

  if (score <= 15) {
    level = "Minimal";
    color = "text-green-400";
  } else if (score <= 30) {
    level = "Mild";
    color = "text-yellow-400";
  } else if (score <= 45) {
    level = "Moderate";
    color = "text-orange-400";
  } else if (score <= 60) {
    level = "Severe";
    color = "text-red-400";
  } else {
    level = "Very Severe";
    color = "text-red-600";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2438] text-white">

      <div className="bg-[#0b1a2a] p-10 rounded-2xl w-[500px] text-center">

        <h1 className="text-3xl font-bold mb-6">
          Your Mental Health Score
        </h1>

        <div className="text-6xl font-bold mb-4">
          {score}
        </div>

        <div className="text-xl text-gray-300 mb-4">
          {percentage}% Mental Stress Level
        </div>

        <div className={`text-2xl font-semibold mb-8 ${color}`}>
          {level}
        </div>

        <button
          onClick={() => window.location.href="/dashboard"}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Take Test Again
        </button>

      </div>

    </div>
  );
}