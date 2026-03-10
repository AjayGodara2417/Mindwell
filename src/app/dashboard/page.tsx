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

const options = ["Never", "Sometimes", "Often", "Always"];

export default function DashboardPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );

  const selectAnswer = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (!answers[current]) return;

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // submit and go to result page
      router.push("/result-dashboard");
    }
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className="w-130 bg-[#0f2438] border border-white/10 rounded-2xl p-8 shadow-xl">

      {/* Header */}
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>QUESTION {current + 1} OF 25</span>
        <span>{progress}% Completed</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10 rounded mb-6">
        <div
          className="h-1 bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-2xl font-semibold mb-2">
        {questions[current].question}
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Select the option that best describes your feelings over the past two weeks.
      </p>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map((option) => {
          const selected = answers[current] === option;

          return (
            <button
              key={option}
              onClick={() => selectAnswer(option)}
              className={`w-full flex justify-between items-center p-4 rounded-lg border transition
              ${
                selected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 hover:border-blue-400"
              }`}
            >
              {option}

              <div
                className={`w-5 h-5 rounded-full border ${
                  selected ? "border-blue-500 bg-blue-500" : "border-white/20"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">

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
          disabled={!answers[current]}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg disabled:opacity-40"
        >
          {current === questions.length - 1 ? "Submit" : "Next Question"}
          <ArrowRight size={16} />
        </button>

      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Your answers are confidential and used to provide personalized mental
        health insights.
      </p>

    </div>
  );
}