"use client";

import { CheckCircle2 } from "lucide-react";

type Option = {
  label: string;
  value: number;
};

type Props = {
  question: string;
  options: Option[];
  selected: number | null;
  onSelect: (value: number) => void;
};

export default function QuestionCard({
  question,
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <h2 className="text-2xl font-bold text-slate-800 text-center leading-relaxed">
        {question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.label}
              onClick={() => onSelect(option.value)}
              className={`
                relative flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 group
                ${
                  isSelected
                    ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                    : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                }
              `}
            >
              <span
                className={`font-semibold ${
                  isSelected ? "text-teal-900" : "text-slate-700"
                }`}
              >
                {option.label}
              </span>

              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${
                    isSelected
                      ? "border-teal-600 bg-teal-600"
                      : "border-slate-300 group-hover:border-teal-400"
                  }
                `}
              >
                {isSelected && (
                  <CheckCircle2 size={14} className="text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}