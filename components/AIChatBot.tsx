"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  context: any;
};

export default function AIChatBox({ context }: Props) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: "ai",
      text: "Hi! I’ve analyzed your assessment. Ask me anything about your mental health or how to improve it.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          context,
        }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "ai", text: data.reply || "Something went wrong." },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "ai", text: "Error connecting to AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col h-[400px]">
      
      {/* Header */}
      <h3 className="font-bold text-slate-800 mb-3">AI Assistant</h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-3 rounded-xl max-w-[80%] ${
              msg.role === "user"
                ? "ml-auto bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your results..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-teal-600 text-white px-3 rounded-lg flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}