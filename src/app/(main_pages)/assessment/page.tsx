"use client";

import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import QuestionCard from "../../../../components/QuestionCard";
import { questions, options } from "@/constants/assessmentQuestions";

export default function AssessmentPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    const lastSubmitted = localStorage.getItem("lastAssessmentDate");
    const today = new Date().toLocaleDateString("en-CA");
    return lastSubmitted === today;
  });

  const progress = Math.round(((current + 1) / questions.length) * 100);

  const handleAnswer = (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    setTimeout(async () => {
      if (current < questions.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        const totalScore = updated.reduce(
          (sum: number, val) => (sum ?? 0) + (val ?? 0),
          0
        );

        // const email = localStorage.getItem("userEmail");

        router.push(`/assessment2?score=${totalScore}`);

        const today = new Date().toLocaleDateString("en-CA");
        localStorage.setItem("lastAssessmentDate", today);

        router.push(`/assessment2?score=${totalScore}`);
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

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Assessment Completed
          </h2>

          <p className="text-slate-600 mb-4">
            You have already submitted todays assessment.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 text-teal-600 font-medium hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">

        {/* Progress */}
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{progress}%</span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            className="h-full bg-teal-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Component */}
        <QuestionCard
          question={questions[current].question}
          options={options}
          selected={answers[current]}
          onSelect={handleAnswer}
        />

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    </div>
  );
}