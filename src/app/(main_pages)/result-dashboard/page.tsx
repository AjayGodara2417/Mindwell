"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export default function ResultDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultDashboardContent />
    </Suspense>
  );
}

function ResultDashboardContent() {
  const params = useSearchParams();
  const router = useRouter();

  const score = Number(params.get("score")) || 0;
  const percentage = Math.round((score / 75) * 100);

  let level = "";
  let color = "";
  let message = "";

  if (score <= 25) {
    level = "Minimal";
    color = "bg-green-500";
    message =
      "Your responses indicate minimal signs of depression. Keep maintaining a healthy lifestyle and stay connected with loved ones.";
  } else if (score <= 50) {
    level = "Mild";
    color = "bg-yellow-500";
    message =
      "You may be experiencing mild symptoms. Consider talking to someone you trust or practicing stress management techniques.";
  } else {
    level = "Severe";
    color = "bg-red-500";
    message =
      "Your responses indicate significant symptoms. It is strongly recommended to consult a mental health professional.";
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-6 py-12">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10 border">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Assessment Report
        </h1>

        {/* Score Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border">

          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Total Score</span>
            <span className="font-semibold">{score} / 75</span>
          </div>

          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Percentage</span>
            <span className="font-semibold">{percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Severity Level</span>
            <span className="font-semibold">{level}</span>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className={`h-3 ${color} transition-all duration-700`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Interpretation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Interpretation
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Suggestions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">
            Suggestions
          </h2>

          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Maintain a regular sleep schedule</li>
            <li>Exercise at least 3–4 times a week</li>
            <li>Talk to friends or family</li>
            <li>Practice mindfulness or meditation</li>
            <li>Seek professional help if symptoms persist</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between">

          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-lg border hover:bg-gray-50"
          >
            Retake Test
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Go Home
          </button>

        </div>

      </div>

    </div>
  );
}
