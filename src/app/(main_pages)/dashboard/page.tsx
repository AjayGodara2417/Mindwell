"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Always", value: 3 },
];

export default function DashboardPage() {
  const router = useRouter();

  const [current, setCurrent] = useState<number>(0);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const selectAnswer = (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const nextQuestion = async () => {
    if (answers[current] === null) return;

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {

      const totalScore = answers.reduce(
        (sum, value) => sum + (value ?? 0),
        0
      );

      const percentage = Math.round((totalScore / 75) * 100);

      const email = localStorage.getItem("userEmail");

      try {
        await fetch("/api/assessment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            score: totalScore,
            percentage,
          }),
        });
      } catch (error) {
        console.error("Error saving result:", error);
      }

      router.push(`/result-dashboard?score=${totalScore}`);
    }
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = Math.round(
    ((current + 1) / questions.length) * 100
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#071421] text-white">

      <div className="w-[520px] bg-[#0f2438] border border-white/10 rounded-2xl p-8 shadow-xl">

        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            QUESTION {current + 1} OF {questions.length}
          </span>
          <span>{progress}% Completed</span>
        </div>

        <div className="w-full h-1 bg-white/10 rounded mb-6">
          <div
            className="h-1 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6">
          {questions[current].question}
        </h2>

        <div className="space-y-4 mb-8">
          {options.map((option) => {

            const selected = answers[current] === option.value;

            return (
              <button
                key={option.label}
                onClick={() => selectAnswer(option.value)}
                className={`w-full flex justify-between items-center p-4 rounded-lg border transition
                ${
                  selected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-blue-400"
                }`}
              >

                {option.label}

                <div
                  className={`w-5 h-5 rounded-full border
                  ${
                    selected
                      ? "border-blue-500 bg-blue-500"
                      : "border-white/20"
                  }`}
                />

              </button>
            );
          })}
        </div>

        <div className="flex justify-between">

          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={answers[current] === null}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-40"
          >
            {current === questions.length - 1 ? "Submit" : "Next"}
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    </div>
  );
}