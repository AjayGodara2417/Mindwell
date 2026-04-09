"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function AIChatModal({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: Record<string, any>;
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hi 👋 I’ve analyzed your assessment. Ask me anything about your mental health or get personalized advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg: { role: "user"; content: string } = { role: "user", content: input };
  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: input,
      userData, // ✅ THIS IS THE FIX
    }),
  });

  const data = await res.json();

  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: data.reply },
  ]);

  setInput("");
  setLoading(false);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Sparkles className="text-teal-600" size={18} />
            AI Health Assistant
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-teal-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="text-xs text-slate-400">AI is typing...</div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your results..."
            className="flex-1 px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={sendMessage}
            className="bg-teal-600 text-white px-4 rounded-xl text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}