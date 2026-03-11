"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCcw, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  const params = useSearchParams();
  const score = Number(params.get("score")) || 0;

  const getResult = () => {
    if (score <= 10) {
      return {
        level: "Minimal",
        color: "text-green-400",
        border: "border-green-500/30",
        bg: "bg-green-500/10",
        message: "You show minimal signs of depression. Maintaining a healthy routine is key.",
      };
    }
    if (score <= 20) {
      return {
        level: "Mild",
        color: "text-yellow-400",
        border: "border-yellow-500/30",
        bg: "bg-yellow-500/10",
        message: "You may be experiencing mild depressive symptoms. It might help to talk to a loved one.",
      };
    }
    if (score <= 40) {
      return {
        level: "Moderate",
        color: "text-orange-400",
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        message: "You may be experiencing moderate depression. We recommend speaking with a counselor.",
      };
    }
    return {
      level: "Severe",
      color: "text-red-400",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      message: "Your responses indicate severe depressive symptoms. Please consider seeking professional help immediately.",
    };
  };

  const result = getResult();
  
  // Calculate percentage for a visual gauge (assuming max score is around 60)
  const percentage = Math.min((score / 60) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1623] text-white p-6">
      <div className="max-w-xl w-full bg-[#0f2438] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Top Accent Bar */}
        <div className={`h-2 w-full ${result.color.replace('text', 'bg')}`} />

        <div className="p-8 md:p-12 text-center">
          <header className="mb-8">
            <h1 className="text-2xl font-medium text-gray-400 mb-2 uppercase tracking-widest">
              Assessment Summary
            </h1>
            <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full" />
          </header>

          {/* Visual Score Gauge */}
          <div className="relative flex items-center justify-center mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * percentage) / 100}
                strokeLinecap="round"
                className={`${result.color} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black">{score}</span>
              <span className="text-sm text-gray-400 uppercase tracking-tighter">Total Score</span>
            </div>
          </div>

          {/* Result Label */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border ${result.border} ${result.bg} ${result.color}`}>
            <AlertCircle size={18} />
            <span className="font-bold uppercase tracking-wide">{result.level} Symptoms</span>
          </div>

          <p className="text-xl text-gray-200 leading-relaxed mb-10 max-w-sm mx-auto">
            {result.message}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <Heart className="text-pink-400 mb-2" size={20} />
              <h3 className="text-sm font-bold text-white">Self-Care</h3>
              <p className="text-xs text-gray-400">Focus on sleep, nutrition, and small walks.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="text-blue-400 mb-2" size={20} />
              <h3 className="text-sm font-bold text-white">Confidential</h3>
              <p className="text-xs text-gray-400">Your results are private and secure.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]">
              Download PDF Report
            </button>
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2 text-sm"
            >
              <RefreshCcw size={16} />
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}