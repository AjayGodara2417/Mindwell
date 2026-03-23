"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const progress = Math.round(((current + 1) / questions.length) * 100);

  const handleAnswer = async (value: number) => {

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

        const percentage = Math.round(((totalScore ?? 0) / 75) * 100);

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
          console.error(error);
        }

        router.push(`/result-dashboard?score=${totalScore}`);
      }

    }, 300);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">

    <div className="w-full max-w-3xl space-y-8">

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 flex-wrap">
        {questions.map((_, index) => {
          const answered = answers[index] !== null;

          return (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition
              ${
                index === current
                  ? "bg-[#2f5d50] scale-125"
                  : answered
                  ? "bg-[#2f5d50]/40"
                  : "bg-gray-300"
              }`}
            />
          );
        })}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-1.5 bg-[#2f5d50] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-xl font-medium text-gray-900 leading-relaxed text-center px-4">
          {questions[current].question}
        </h2>

        {/* Options */}
        <div className="space-y-3">

          {options.map((option) => {
            const selected = answers[current] === option.value;

            return (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.value)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition
                ${
                  selected
                    ? "bg-[#2f5d50] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >

                <span className="text-base font-medium">
                  {option.label}
                </span>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${
                    selected
                      ? "border-white bg-white"
                      : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 bg-[#2f5d50] rounded-full" />
                  )}
                </div>

              </button>
            );
          })}

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">

          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="text-xs text-gray-400">
            Select an option to continue
          </span>

        </div>

      </div>

    </div>
  </div>
);
}