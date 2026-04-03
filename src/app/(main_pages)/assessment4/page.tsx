"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function SliderCard({
  label,
  value,
  setValue,
  type,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  type: "mood" | "energy" | "stress";
}) {
  const getFeedback = () => {
    if (type === "mood") {
      if (value <= 3) return { text: "Low mood", emoji: "😔" };
      if (value <= 7) return { text: "Balanced", emoji: "🙂" };
      return { text: "Great mood", emoji: "😄" };
    }

    if (type === "energy") {
      if (value <= 3) return { text: "Low energy", emoji: "😴" };
      if (value <= 7) return { text: "Stable", emoji: "⚡" };
      return { text: "High energy", emoji: "🔥" };
    }

    if (type === "stress") {
      if (value <= 3) return { text: "Relaxed", emoji: "😌" };
      if (value <= 7) return { text: "Manageable", emoji: "🙂" };
      return { text: "High stress", emoji: "😣" };
    }

    // Default case to ensure function always returns a value
    return { text: "Unknown", emoji: "❓" };
  };

  const feedback = getFeedback();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-slate-700">{label}</span>

        <div className="flex items-center gap-2 text-sm font-medium text-teal-600">
          <span>{feedback.emoji}</span>
          <span>{feedback.text}</span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-teal-600 cursor-pointer"
      />

      {/* Scale */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </motion.div>
  );
}

export default function AssessmentFour() {
  const router = useRouter();
  const params = useSearchParams();

  const score = params.get("score");
  const memoryLevel = params.get("memoryLevel");
  const moodText = params.get("mood");
  const financial = params.get("financial");

  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);

  const handleSubmit = async () => {
    const email = localStorage.getItem("userEmail");

    await fetch("/api/rating-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mood, energy, stress }),
    });

    router.push(
      `/result-dashboard?score=${score}&memoryLevel=${memoryLevel}&mood=${moodText}&financial=${financial}&moodScore=${mood}&energy=${energy}&stress=${stress}`
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            How are you feeling right now?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Adjust the sliders to reflect your current state
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          <SliderCard label="Mood" value={mood} setValue={setMood} type="mood" />
          <SliderCard label="Energy Level" value={energy} setValue={setEnergy} type="energy" />
          <SliderCard label="Stress Level" value={stress} setValue={setStress} type="stress" />
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          className="w-full bg-linear-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          See My Results
        </button>

      </div>
    </div>
  );
}