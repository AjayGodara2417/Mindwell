"use client";

import { useState } from "react";
import SimonGame from "@/components/cognitive/SimonGame";
import ReactionTest from "@/components/cognitive/ReactionTest";
import ColorTest from "@/components/cognitive/ColorTest";
import DigitSpanTest from "@/components/cognitive/DigitSpan";
import StroopTest from "@/components/cognitive/StroopTest";
import CognitiveSummary from "@/components/cognitive/CognitiveSummary";

export default function CognitivePage() {
  const [step, setStep] = useState(0);

  const [scores, setScores] = useState({
    memory: 0,
    reaction: 0,
    attention: 0,
    digit: 0,
    stroop: 0,
  });

  const next = () => setStep((prev) => prev + 1);

  const updateScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem("userEmail");

    const totalScore = Object.values(scores).reduce(
      (a, b) => a + b,
      0
    );

    await fetch("/api/cognitive/full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...scores, totalScore }),
    });

    alert("Cognitive Test Completed!");
  };

  switch (step) {
    case 0:
      return (
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">
            Cognitive Assessment
          </h1>
          <button onClick={next} className="btn">
            Start Test
          </button>
        </div>
      );

    case 1:
      return (
        <SimonGame
          onComplete={(score) => {
            updateScore("memory", score);
            next();
          }}
        />
      );

    case 2:
      return (
        <ReactionTest
          onComplete={(score) => {
            updateScore("reaction", score);
            next();
          }}
        />
      );

    case 3:
      return (
        <ColorTest
          onComplete={(score) => {
            updateScore("attention", score);
            next();
          }}
        />
      );

    case 4:
      return (
        <DigitSpanTest
          onComplete={(score) => {
            updateScore("digit", score);
            next();
          }}
        />
      );

    case 5:
      return (
        <StroopTest
          onComplete={(score) => {
            updateScore("stroop", score);
            next();
          }}
        />
      );

    case 6:
      return (
        <CognitiveSummary
          scores={scores}
          onSubmit={handleSubmit}
        />
      );

    default:
      return null;
  }
}