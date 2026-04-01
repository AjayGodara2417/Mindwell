"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function AssessmentThree() {
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

  const handleSubmit = async () => {
    const email = localStorage.getItem("userEmail");

    await fetch("/api/subjective-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        ...form,
      }),
    });

    router.push(
  `/assessment4?score=${baseScore}&memoryLevel=${memoryLevel}&mood=${form.mood}&financial=${form.financial}`
);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Final Check-in
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Help us understand your current state better
          </p>
        </div>

        {/* Illness */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Any illness recently?
          </label>
          <textarea
            className="w-full mt-2 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="e.g. Fever, headache, fatigue..."
            value={form.illness}
            onChange={(e) =>
              setForm({ ...form, illness: e.target.value })
            }
          />
        </div>

        {/* Thoughts */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            What’s on your mind?
          </label>
          <textarea
            className="w-full mt-2 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="You can share anything..."
            value={form.thoughts}
            onChange={(e) =>
              setForm({ ...form, thoughts: e.target.value })
            }
          />
        </div>

        {/* Financial Stress */}
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
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  form.financial === level
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
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
                className={`p-4 rounded-xl border text-center cursor-pointer transition ${
                  form.mood === m.label
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="text-xs mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition"
        >
          Finish Assessment
        </button>
      </div>
    </div>
  );
}