"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

/**
 * Modern Result Dashboard
 * - Tailwind CSS required
 * - Small helper components included (Radial, MiniBar, Sparkline)
 */

function RadialProgress({ value, size = 96 }: { value: number; size?: number }) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg
      height={size}
      width={size}
      viewBox={`0 0 ${radius * 2 + stroke} ${radius * 2 + stroke}`}
      className="block"
      aria-hidden
    >
      <g transform={`translate(${stroke / 2}, ${stroke / 2})`}>
        <circle
          stroke="#e6eef0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#2f5d50"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-semibold text-gray-900"
          style={{ fontSize: 14 }}
        >
          {value}%
        </text>
      </g>
    </svg>
  );
}

function MiniBar({ value, color = "bg-teal-600" }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`${color} h-3 rounded-full transition-all duration-700`}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function Sparkline({ points = [49, 46, 44, 42] }: { points?: number[] }) {
  const max = Math.max(...points, 1);
  const step = 96 / Math.max(points.length - 1, 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${40 - (p / max) * 30}`)
    .join(" ");
  return (
    <svg viewBox="0 0 96 40" className="w-full h-12">
      <path d={path} fill="none" stroke="#2f5d50" strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={i * step} cy={40 - (p / max) * 30} r="2.2" fill="#2f5d50" />
      ))}
    </svg>
  );
}

export default function ResultDashboard() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResultDashboardContent />
    </Suspense>
  );
}

function ResultDashboardContent() {
  const params = useSearchParams();
  const router = useRouter();

  const score = Number(params?.get("score")) || 42;
  const percentage = Math.round((score / 75) * 100);

  let level = "";
  let colorClass = "";
  let message = "";

  if (score <= 25) {
    level = "Minimal";
    colorClass = "bg-green-500";
    message =
      "Your responses indicate minimal signs of depression. Keep maintaining a healthy lifestyle and stay connected with loved ones.";
  } else if (score <= 50) {
    level = "Moderate";
    colorClass = "bg-yellow-500";
    message =
      "Your current score indicates moderate symptoms. Consider short-term focused actions and follow-up with your clinician.";
  } else {
    level = "Severe";
    colorClass = "bg-red-500";
    message =
      "Your responses indicate significant symptoms. It is strongly recommended to consult a mental health professional.";
  }

  const patientName = params?.get("patient") || "Sarah Jenkins";
  const completedOn = params?.get("date") || "Oct 24, 2023";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f6f8f7] to-white p-6 flex items-start justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Assessment Results</h1>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Patient:</span> <span className="text-gray-700">{patientName}</span>{" "}
              • <span className="text-gray-500">Completed on {completedOn}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 py-2 text-sm border rounded-md text-teal-700 hover:bg-teal-50"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-3 py-2 text-sm bg-teal-700 text-white rounded-md shadow-sm hover:opacity-95"
            >
              Profile
            </button>
          </div>
        </header>

        {/* Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Score card */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 ">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <RadialProgress value={percentage} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Total Score</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{score} / 75</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`} aria-hidden />
                    <span className="text-sm font-medium text-gray-800">{level}</span>
                    <span className="text-xs text-gray-400 ml-2">({percentage}%)</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{message}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-3 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Retake Test
                </button>
                <button
                  onClick={() => router.push("/stats")}
                  className="px-3 py-2 text-sm bg-[#2f5d50] text-white rounded-lg hover:opacity-95"
                >
                  View Stats
                </button>
              </div>
            </div>

            {/* Quick clinical summary */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium text-gray-800">Clinically Stable</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Risk</div>
                  <div className="font-medium text-gray-800">Low / Manageable</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Quick clinical note: primary drivers are low energy and sleep disturbances; social engagement improving.
              </div>
            </div>
          </section>

          {/* Middle column: Symptom breakdown & trend */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Clinical Analysis</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {message} This summary highlights the main contributors to the score and contextualizes recent changes versus baseline.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-[#f9faf9] rounded-lg">
                  <div className="text-xs text-gray-500">Primary Driver</div>
                  <div className="font-medium text-gray-800">Low Energy</div>
                </div>
                <div className="p-3 bg-[#f9faf9] rounded-lg">
                  <div className="text-xs text-gray-500">Secondary Driver</div>
                  <div className="font-medium text-gray-800">Sleep Disturbance</div>
                </div>
                <div className="p-3 bg-[#f9faf9] rounded-lg">
                  <div className="text-xs text-gray-500">Social Engagement</div>
                  <div className="font-medium text-gray-800">Improving</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-md font-medium text-gray-800 mb-4">Symptom Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Sleep Hygiene</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <MiniBar value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Energy Levels</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <MiniBar value={62} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Social Interest</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <MiniBar value={34} color="bg-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Cognitive Focus</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <MiniBar value={45} color="bg-rose-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6  flex flex-col">
                <h3 className="text-md font-medium text-gray-800 mb-2">Historical Trend</h3>
                <Sparkline />
                <div className="mt-3 text-sm text-gray-600">
                  <div><strong>14% Improvement</strong> compared to <strong>Sept 12 (Score: 49)</strong></div>
                  <div className="text-xs text-gray-400 mt-1">Trend shows gradual improvement over the last 3 assessments.</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-2 text-sm border rounded-md">View Full History</button>
                  <button className="px-3 py-2 text-sm bg-teal-700 text-white rounded-md">Compare Baseline</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 ">
              <h3 className="text-md font-medium text-gray-800 mb-3">Next Steps (7 days)</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-teal-700 font-semibold">•</span>
                  <div>
                    <div className="font-medium">Message Dr. Thorne</div>
                    <div className="text-xs text-gray-500">Discuss energy fluctuations</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-700 font-semibold">•</span>
                  <div>
                    <div className="font-medium">Schedule Follow-up</div>
                    <div className="text-xs text-gray-500">Secure your spot for Nov 1</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-700 font-semibold">•</span>
                  <div>
                    <div className="font-medium">Recommended Reading</div>
                    <div className="text-xs text-gray-500">Managing Sleep Patterns</div>
                  </div>
                </li>
              </ul>

              <div className="mt-4 flex gap-3">
                <button onClick={() => router.push("/messages")} className="px-4 py-2 bg-white border rounded-md text-sm">Message Clinician</button>
                <button onClick={() => router.push("/book")} className="px-4 py-2 bg-teal-700 text-white rounded-md text-sm">Book Follow-up</button>
                <button onClick={() => router.push("/resources")} className="ml-auto px-4 py-2 border rounded-md text-sm">Resources</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}