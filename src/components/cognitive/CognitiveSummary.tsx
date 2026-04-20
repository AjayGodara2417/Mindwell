"use client";

import TestLayout from "./TestLayout";
import {
  Brain,
  Zap,
  Target,
  Hash,
  Type,
} from "lucide-react";
import { CognitiveResultProps } from "@/types/cognitive";

export default function CognitiveResult({
  scores,
  onSubmit,
}: CognitiveResultProps) {
  const items = [
    {
      label: "Memory",
      value: scores.memory,
      icon: Brain,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Reaction",
      value: scores.reaction,
      icon: Zap,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Attention",
      value: scores.attention,
      icon: Target,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Digit Span",
      value: scores.digit,
      icon: Hash,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Stroop",
      value: scores.stroop,
      icon: Type,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const total = Object.values(scores).reduce(
  (a: number, b: number) => a + b,
  0
);

  return (
    <TestLayout
      title="Final Results"
      subtitle="Here’s how you performed"
    >
      {/* SCORE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 p-4 rounded-2xl border bg-slate-50"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color}`}
              >
                <Icon size={20} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  {item.label}
                </p>
                <p className="text-xl font-semibold">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL SCORE */}
      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          Overall Cognitive Score
        </p>
        <h2 className="text-3xl font-bold text-teal-600">
          {total}
        </h2>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={onSubmit}
        className="btn w-full mt-4"
      >
        Submit Results
      </button>
    </TestLayout>
  );
}