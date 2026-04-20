import TestLayout from "./TestLayout";
import { useState, useEffect } from "react";
import { TestProps } from "@/types/cognitive";

export default function DigitSpanTest({ onComplete }: TestProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [length, setLength] = useState(3);

  useEffect(() => {
    const seq = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    );
    setSequence(seq);
  }, [length]);

  const submit = () => {
    if (input === sequence.join("")) {
      setLength((l) => l + 1);
      setInput("");
    } else {
      onComplete(length * 2);
    }
  };

  return (
    <TestLayout
      title="Memory Recall"
      subtitle="Remember the numbers"
    >
      <h2 className="text-center text-2xl font-bold">
        {sequence.join(" ")}
      </h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border rounded-xl text-center"
      />

      <button onClick={submit} className="btn w-full">
        Submit
      </button>
    </TestLayout>
  );
}