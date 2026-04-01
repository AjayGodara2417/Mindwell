"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const questions = [
  { id: 1, question: "I feel sad or empty most of the day." },
  { id: 2, question: "I have lost interest in activities I used to enjoy." },
  { id: 3, question: "I have trouble falling asleep or staying asleep." },
  { id: 4, question: "I feel tired or have little energy." },
  { id: 5, question: "I have changes in my appetite or weight." },
  { id: 6, question: "I feel worthless or guilty." },
  { id: 7, question: "I have trouble concentrating or making decisions." },
  { id: 8, question: "I feel restless or slowed down." },
  { id: 9, question: "I have thoughts of death or suicide." },
  { id: 10, question: "I feel anxious or worried." },
  { id: 11, question: "I get irritated easily." },
  { id: 12, question: "I feel hopeless about the future." },
  { id: 13, question: "I isolate myself from friends and family." },
  { id: 14, question: "I feel overwhelmed by daily tasks." },
  { id: 15, question: "I have physical aches or pains without clear cause." },
  { id: 16, question: "I feel like crying for no reason." },
  { id: 17, question: "I have trouble getting out of bed." },
  { id: 18, question: "I feel like a failure." },
  { id: 19, question: "I criticize myself constantly." },
  { id: 20, question: "I feel lonely even when with others." },
  { id: 21, question: "I have no motivation to do anything." },
  { id: 22, question: "I feel like a burden to others." },
  { id: 23, question: "I have trouble enjoying food." },
  { id: 24, question: "I feel numb or empty." },
  { id: 25, question: "I feel like life is not worth living." },
];

const options = [
  { label: "Never", value: 0, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  { label: "Sometimes", value: 1, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
  { label: "Often", value: 2, color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
  { label: "Always", value: 3, color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    const lastSubmitted = localStorage.getItem("lastAssessmentDate");
    const today = new Date().toLocaleDateString("en-CA");
    return lastSubmitted === today;
  });

  const progress = Math.round(((current + 1) / questions.length) * 100);

  const handleAnswer = async (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    // Small delay for visual feedback
    setTimeout(async () => {
      if (current < questions.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        const totalScore = updated.reduce((sum: number, val) => (sum ?? 0) + (val ?? 0), 0);
        const percentage = Math.round(((totalScore ?? 0) / 75) * 100);
        const email = localStorage.getItem("userEmail");

        try {
          await fetch("/api/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, score: totalScore, percentage }),
          });
        } catch (error) {
          console.error(error);
        }

        const today = new Date().toLocaleDateString("en-CA");
        localStorage.setItem("lastAssessmentDate", today);
        router.push(`/result-dashboard?score=${totalScore}`);
      }
    }, 250);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // 🔒 LOCK SCREEN
  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-amber-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Assessment Completed</h2>
          <p className="text-slate-600 mb-4">You have already submitted todays assessment.</p>
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-500">
            Please come back tomorrow. The assessment will be available again after midnight.
          </div>
          <button onClick={() => router.push('/dashboard')} className="mt-6 text-teal-600 font-medium hover:underline">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">

        {/* Progress Header */}
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{progress}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <h2 className="text-2xl font-bold text-slate-800 text-center leading-relaxed">
            {questions[current].question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option) => {
              const selected = answers[current] === option.value;
              return (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    relative flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 group
                    ${selected 
                      ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" 
                      : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className={`font-semibold ${selected ? "text-teal-900" : "text-slate-700"}`}>
                    {option.label}
                  </span>
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${selected ? "border-teal-600 bg-teal-600" : "border-slate-300 group-hover:border-teal-400"}
                  `}>
                    {selected && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={prevQuestion}
              disabled={current === 0}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span className="text-xs text-slate-400 italic">
              Select an option to continue
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}