"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import AIChatBox from "../../../../components/AIChatBot";

/* ---------------- ENHANCED RADIAL PROGRESS ---------------- */
function RadialProgress({ value, size = 160 }: { value: number; size?: number }) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={size} width={size} className="rotate-90">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out drop-shadow-lg"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-800">{value}%</p>
        <p className="text-sm text-slate-500">Stress Score</p>
      </div>
    </div>
  );
}

/* ---------------- PAGE WRAPPER ---------------- */
export default function ResultDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-slate-500">
          Loading results...
        </div>
      }
    >
      <ResultDashboardContent />
    </Suspense>
  );
}

/* ---------------- MAIN CONTENT ---------------- */
function ResultDashboardContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [severity, setSeverity] = useState("Unknown");
  const [finalScore, setFinalScore] = useState(0);
  const [emotion, setEmotion] = useState("");

  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);
  const [consultDoctor, setConsultDoctor] = useState(false);


  /* ---------------- 🔥 PRIORITY 1: LOAD ML RESULT ---------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mlResult");

      console.log("RAW STORAGE:", stored);

      if (!stored || stored === "undefined" || stored === "null") {
        console.warn("Invalid ML data in localStorage");
        localStorage.removeItem("mlResult");
        return;
      }

      const data = JSON.parse(stored);
      console.log("PARSED ML:", data);

      if (data && Object.keys(data).length > 0) {
        // ✅ FIX: ML gives normalized score (0–1)
        const calculatedScore = Math.round(
          (data.questionnaire_score || 0) * 75
        );

        console.log("ML CALCULATED SCORE:", calculatedScore);

        setScore(calculatedScore);
        setSeverity(data.severity || "Unknown");
        setFinalScore(data.final_score || 0);
        setEmotion(data.emotion || "");

        setRecommendations(data.recommendations || []);
        setDiet(data.diet || []);
        setConsultDoctor(data.consult_doctor || false);
      }
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);
      localStorage.removeItem("mlResult");
    }
  }, []);


  /* ---------------- 🔥 FALLBACK: FETCH FROM DB ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) return;

        const res = await fetch(`/api/assessment?email=${email}`);
        const data = await res.json();

        console.log("DB DATA:", data);

        if (data.history && data.history.length > 0) {
          const latest = data.history[0];

          const mlData = localStorage.getItem("mlResult");

          // ✅ ONLY run if ML not present
          if (!mlData || mlData === "undefined" || mlData === "null") {
            console.log("USING DB DATA");

            // ✅ DB already has real score (0–75)
            setScore(latest.score || 0);
            setFinalScore(latest.final_score || 0);
            setSeverity(latest.severity || "Unknown");
            setEmotion(latest.emotion || "");

            setRecommendations(latest.recommendations || []);
            setDiet(latest.diet || []);
            setConsultDoctor(latest.consult_doctor || false);
          }
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchData();
  }, []);
  const percentage = Math.round((score / 75) * 100);

  /* ---------------- MESSAGE ---------------- */
  let message = "";

  if (severity === "Low Stress") {
    message = "You're doing well. Maintain a healthy lifestyle.";
  } else if (severity === "Moderate Stress") {
    message = "You're experiencing moderate stress. Stay mindful.";
  } else {
    message = "Your stress level is high. Consider professional help.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">
            🧠 Assessment Results
          </h1>
        </header>

        {/* MAIN CARD */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-white p-8 rounded-2xl shadow flex flex-col items-center justify-center">
            <RadialProgress value={percentage} />

            {emotion && (
              <span className="mt-4 px-4 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
                Emotion : {emotion}
              </span>
            )}
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-1 gap-4">

            <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
              <Activity className="text-teal-600" />
              <div>
                <p className="text-sm text-slate-500">Severity Level</p>
                <p className="text-xl font-bold text-teal-600">{severity}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
              <TrendingUp className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Final Score</p>
                <p className="text-xl font-bold">{finalScore}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
              <Calendar className="text-purple-600" />
              <div>
                <p className="text-sm text-slate-500">Questionnaire Score</p>
                <p className="text-xl font-bold">{score}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ALERT */}
        {consultDoctor && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl">
            ⚠️ Your stress level is high. Please consult a doctor immediately.
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">🧠 Recommendations</h2>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* DIET */}
        {diet.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">🥗 Diet Plan</h2>
            <ul className="list-disc pl-5 space-y-2">
              {diet.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* MESSAGE */}
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <p className="text-slate-800 font-medium">{message}</p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-slate-200 rounded-xl"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl"
          >
            Profile
          </button>
        </div>

      </div>
    </div>
  );
}