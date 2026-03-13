"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const score = Number(params.get("score")) || 0;
  const percentage = Math.round((score / 75) * 100);

  let level = "";
  let color = "";
  let bg = "";

  if (score <= 15) {
    level = "Minimal";
    color = "text-green-600";
    bg = "bg-green-500";
  } else if (score <= 30) {
    level = "Mild";
    color = "text-yellow-500";
    bg = "bg-yellow-400";
  } else if (score <= 45) {
    level = "Moderate";
    color = "text-orange-500";
    bg = "bg-orange-500";
  } else if (score <= 60) {
    level = "Severe";
    color = "text-red-500";
    bg = "bg-red-500";
  } else {
    level = "Very Severe";
    color = "text-red-700";
    bg = "bg-red-700";
  }

  return (
    <div className="flex justify-center w-full py-20 px-6 bg-gray-100 min-h-screen">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">

        <h1 className="text-3xl font-bold text-gray-800 mb-10">
          Your Mental Health Result
        </h1>

        <div className="text-7xl font-bold text-blue-600 mb-2">
          {score}
        </div>

        <div className="text-gray-500 mb-8">
          {percentage}% Mental Stress Level
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-4 ${bg} transition-all duration-700`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className={`text-2xl font-semibold mb-10 ${color}`}>
          {level}
        </div>

        <p className="text-gray-500 mb-10 leading-relaxed">

          {level === "Minimal" &&
            "Your responses indicate very low signs of stress or depression. Continue maintaining healthy habits and self-care."}

          {level === "Mild" &&
            "You may be experiencing mild stress or emotional difficulty. Practicing mindfulness, relaxation, and good sleep habits can help."}

          {level === "Moderate" &&
            "Your results indicate moderate stress levels. Consider talking to a mental health professional or trying structured self-care activities."}

          {level === "Severe" &&
            "Your responses suggest high stress levels. It may be helpful to consult a mental health professional for guidance."}

          {level === "Very Severe" &&
            "Your results indicate very high stress levels. Please consider reaching out to a mental health professional for support."}

        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Take Test Again
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ResultDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}