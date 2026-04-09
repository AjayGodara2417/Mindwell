"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function AssessmentThreeInner() {
  const router = useRouter();
  const params = useSearchParams();

  const baseScore = params.get("score");
  const memoryLevel = params.get("memoryLevel");

  const [form, setForm] = useState({
    illness: "",
    thoughts: "",
    financial: "",
    mood: "",
  });

  const moods = [
    { label: "Happy", emoji: "😊" },
    { label: "Neutral", emoji: "😐" },
    { label: "Sad", emoji: "😔" },
    { label: "Stressed", emoji: "😡" },
    { label: "Tired", emoji: "😴" },
  ];

  const stressLevels = ["Low", "Moderate", "High"];

  const handleSubmit = () => {
    // ✅ validation
    if (!form.mood || !form.financial) {
      alert("Please select mood and financial stress");
      return;
    }

    router.push(
      `/assessment4?score=${baseScore}
      &memoryLevel=${memoryLevel}
      &mood=${encodeURIComponent(form.mood)}
      &financial=${encodeURIComponent(form.financial)}
      &illness=${encodeURIComponent(form.illness)}
      &thoughts=${encodeURIComponent(form.thoughts)}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Final Check-in
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Help us understand your current state better
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Any illness recently?
          </label>
          <textarea
            className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
            value={form.illness}
            onChange={(e) =>
              setForm({ ...form, illness: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            What’s on your mind?
          </label>
          <textarea
            className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
            value={form.thoughts}
            onChange={(e) =>
              setForm({ ...form, thoughts: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Financial Stress
          </label>

          <div className="flex gap-3 mt-3">
            {stressLevels.map((level) => (
              <button
                key={level}
                onClick={() =>
                  setForm({ ...form, financial: level })
                }
                className={`px-4 py-2 rounded-full border ${
                  form.financial === level
                    ? "bg-teal-600 text-white"
                    : "bg-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Your Mood Today
          </label>

          <div className="grid grid-cols-3 gap-4 mt-3">
            {moods.map((m) => (
              <motion.div
                key={m.label}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setForm({ ...form, mood: m.label })
                }
                className={`p-4 rounded-xl border text-center cursor-pointer ${
                  form.mood === m.label
                    ? "bg-teal-500 text-white"
                    : "bg-white"
                }`}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="text-xs mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-3 rounded-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function AssessmentThree() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentThreeInner />
    </Suspense>
  );
}