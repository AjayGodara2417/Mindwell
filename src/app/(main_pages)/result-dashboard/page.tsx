"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Activity, TrendingUp, Calendar, MessageSquare, BookOpen } from "lucide-react";

function RadialProgress({ value, size = 120 }: { value: number; size?: number }) {
  const radius = 55;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg height={size} width={size} className="block rotate-[-90deg]">
      <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={size / 2} cy={size / 2} />
      <circle
        stroke="#0d9488"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-1000 ease-out"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-slate-800 font-bold text-xl rotate-[90deg]">
        {value}%
      </text>
    </svg>
  );
}

function MiniBar({ value, color = "bg-teal-600", label }: { value: number; color?: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ResultDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-500">Loading results...</div>}>
      <ResultDashboardContent />
    </Suspense>
  );
}

function generateInsight(mood: number, energy: number, stress: number) {
  if (stress >= 8 && mood <= 4) {
    return "High stress combined with low mood detected. Consider rest and reaching out for support.";
  }

  if (energy <= 3) {
    return "Low energy levels observed. Sleep and recovery might help improve overall wellbeing.";
  }

  if (mood >= 7 && stress <= 4) {
    return "You are in a positive and balanced state. Keep maintaining your current routine.";
  }

  return "Your current state is moderately balanced. Small lifestyle improvements can help optimize wellbeing.";
}

function Metric({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "mood" | "energy" | "stress";
}) {
  const getConfig = () => {
    if (type === "mood") {
      if (value <= 3) return { text: "Low", emoji: "😔", color: "bg-red-400" };
      if (value <= 7) return { text: "Balanced", emoji: "🙂", color: "bg-amber-400" };
      return { text: "Positive", emoji: "😄", color: "bg-green-500" };
    }

    if (type === "energy") {
      if (value <= 3) return { text: "Low", emoji: "😴", color: "bg-blue-400" };
      if (value <= 7) return { text: "Stable", emoji: "⚡", color: "bg-indigo-400" };
      return { text: "High", emoji: "🔥", color: "bg-purple-500" };
    }

    if (type === "stress") {
      if (value <= 3) return { text: "Relaxed", emoji: "😌", color: "bg-green-400" };
      if (value <= 7) return { text: "Moderate", emoji: "🙂", color: "bg-amber-400" };
      return { text: "High", emoji: "😣", color: "bg-red-500" };
    }
  };

  const config = getConfig();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span>{config.emoji}</span>
          <span>{config.text}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${config.color}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

function ResultDashboardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const score = Number(params?.get("score")) || 42;
  const percentage = Math.round((score / 75) * 100);
  const memoryLevel = Number(params?.get("memoryLevel")) || 0;
  const mood = params?.get("mood") || "";
  const financial = params?.get("financial") || "";
  const moodScore = Number(params?.get("moodScore")) || 0;
  const energy = Number(params?.get("energy")) || 0;
  const stress = Number(params?.get("stress")) || 0;

  let level = "";
  let colorClass = "";
  let message = "";
  let themeColor = "text-teal-600";

  if (score <= 25) {
    level = "Minimal";
    colorClass = "bg-emerald-500";
    themeColor = "text-emerald-600";
    message = "Your responses indicate minimal signs of depression. Keep maintaining a healthy lifestyle.";
  } else if (score <= 50) {
    level = "Moderate";
    colorClass = "bg-amber-500";
    themeColor = "text-amber-600";
    message = "Your current score indicates moderate symptoms. Consider short-term focused actions.";
  } else {
    level = "Severe";
    colorClass = "bg-red-500";
    themeColor = "text-red-600";
    message = "Your responses indicate significant symptoms. It is recommended to consult a professional.";
  }

  let cognitiveNote = "";

  if (memoryLevel >= 8) {
    cognitiveNote = "Strong cognitive performance observed.";
  } else if (memoryLevel >= 5) {
    cognitiveNote = "Moderate focus levels. Can improve with exercises.";
  } else {
    cognitiveNote = "Low attention span detected. Cognitive training recommended.";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assessment Results</h1>
            <p className="text-slate-500 text-sm mt-1">Completed on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Dashboard
            </button>
            <button onClick={() => router.push("/profile")} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all">
              View Profile
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Score Card */}
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center">

              {/* Score + Label */}
              <div className="relative">
                <RadialProgress value={percentage} />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {percentage}%
                  </span>
                  <span className="text-xs text-slate-400">
                    Overall Score
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Severity Level
                </p>

                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold 
      ${themeColor.replace("text-", "bg-").replace("600", "100")} ${themeColor}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${colorClass.replace("bg-", "bg-")
                      }`}
                  ></span>
                  {level}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 my-6" />

              {/* Message */}
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                {message}
              </p>

              {/* Actions */}
              <div className="mt-8 w-full grid grid-cols-2 gap-3">

                {/* Secondary */}
                <button
                  onClick={() => router.push("/assessment")}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Retake
                </button>

                {/* Primary */}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>

            {/* Memory Score Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  🧠
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Cognitive Performance
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Simon Level</span>
                  <span className="text-lg font-bold text-purple-600">
                    {memoryLevel}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(memoryLevel * 10, 100)}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  Higher levels indicate better attention span and working memory.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Personal Insights
              </h2>

              <div className="space-y-4">

                {/* Mood */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm text-slate-500">Mood</span>
                  <span className="font-semibold text-slate-800">
                    {mood || "Not provided"}
                  </span>
                </div>

                {/* Financial */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm text-slate-500">
                    Financial Stress
                  </span>
                  <span
                    className={`font-semibold ${financial === "High"
                      ? "text-red-500"
                      : financial === "Moderate"
                        ? "text-amber-500"
                        : "text-green-500"
                      }`}
                  >
                    {financial || "Not provided"}
                  </span>
                </div>

                {/* Insight */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-900">
                  {mood === "Sad" || financial === "High"
                    ? "Your emotional and financial inputs suggest elevated stress. Consider reaching out for support."
                    : "Your responses indicate stable emotional condition. Continue healthy habits."}
                </div>

              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Self Perception
                  </h2>
                  <p className="text-xs text-slate-500">
                    Based on your real-time inputs
                  </p>
                </div>
                <div className="text-2xl">🧠</div>
              </div>

              {/* Metrics */}
              <div className="space-y-5">

                {/* Mood */}
                <Metric
                  label="Mood"
                  value={moodScore}
                  type="mood"
                />

                {/* Energy */}
                <Metric
                  label="Energy"
                  value={energy}
                  type="energy"
                />

                {/* Stress */}
                <Metric
                  label="Stress"
                  value={stress}
                  type="stress"
                />

              </div>

              {/* Insight */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
                {generateInsight(moodScore, energy, stress)}
              </div>
            </div>

            {/* Clinical Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
                <Activity size={18} />
                <span>Clinical Note</span>
              </div>
              <p className="text-sm text-blue-900/80 leading-relaxed">
                {message} {cognitiveNote}
              </p>
            </div>
          </section>

          {/* Right Column: Details */}
          <section className="lg:col-span-2 space-y-6">

            {/* Symptom Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Symptom Breakdown</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <MiniBar value={78} label="Sleep Hygiene" color="bg-indigo-500" />
                <MiniBar value={62} label="Energy Levels" color="bg-amber-500" />
                <MiniBar value={34} label="Social Interest" color="bg-pink-500" />
                <MiniBar value={45} label="Cognitive Focus" color="bg-blue-500" />
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Calendar size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Recommended Next Steps</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">1</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Message Your Clinician</h4>
                    <p className="text-xs text-slate-500 mt-1">Discuss your recent energy fluctuations.</p>
                  </div>
                  <button onClick={() => router.push("/messages")} className="ml-auto text-xs font-medium text-teal-600 hover:underline">Send</button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">2</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Schedule Follow-up</h4>
                    <p className="text-xs text-slate-500 mt-1">Secure your spot for the next review.</p>
                  </div>
                  <button onClick={() => router.push("/planner")} className="ml-auto text-xs font-medium text-teal-600 hover:underline">Book</button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">3</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Read: Managing Sleep</h4>
                    <p className="text-xs text-slate-500 mt-1">Recommended article from our library.</p>
                  </div>
                  <button onClick={() => router.push("/resources")} className="ml-auto text-xs font-medium text-teal-600 hover:underline">Read</button>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}