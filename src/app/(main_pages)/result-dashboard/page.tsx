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
  <div className="min-h-screen flex justify-center items-center bg-[#f6f8f7] p-6">

    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 space-y-6">

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Assessment Report
        </h1>
        <p className="text-sm text-gray-500">
          Your mental health summary
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-[#f4f7f6] rounded-2xl p-6 space-y-3">

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Score</span>
          <span className="font-medium">{score} / 75</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Percentage</span>
          <span className="font-medium">{percentage}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Severity</span>
          <span className="font-medium">{level}</span>
        </div>

      </div>

      {/* Progress */}
      <div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`${color} h-2 rounded-full transition-all duration-700`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Interpretation */}
      <div>
        <h2 className="text-lg font-medium mb-2 text-gray-800">
          Interpretation
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Suggestions */}
      <div>
        <h2 className="text-lg font-medium mb-2 text-gray-800">
          Suggestions
        </h2>

        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Maintain a regular sleep schedule</li>
          <li>Exercise regularly</li>
          <li>Talk to someone you trust</li>
          <li>Practice mindfulness</li>
          <li>Seek help if needed</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-4 pt-4">

        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 border border-gray-200 py-2 rounded-xl text-sm hover:bg-gray-50"
        >
          Retake Test
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 bg-[#2f5d50] text-white py-2 rounded-xl text-sm hover:opacity-90"
        >
          View Stats
        </button>

      </div>

    </div>
  </div>
);
}
