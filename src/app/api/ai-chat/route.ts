import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // important

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const prompt = `
You are a mental health assistant AI.

Patient Data:
- Depression Score: ${context.score}/75
- Severity: ${context.severity}
- Memory Level: ${context.memoryLevel}
- Mood Score: ${context.moodScore}/10
- Energy: ${context.energy}/10
- Stress: ${context.stress}/10
- Mood: ${context.mood}
- Financial Stress: ${context.financial}

Instructions:
- Be empathetic and supportive
- Give practical suggestions
- Do NOT diagnose
- Keep responses concise

User Question:
${message}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // optional but recommended
        "X-Title": "Mental Health App",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // 🔥 fast + cheap + good
        messages: [
          {
            role: "system",
            content: "You are a helpful mental health assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ success: true, reply });

  } catch (err) {
    console.error("OPENROUTER ERROR:", err);

    return NextResponse.json({
      success: false,
      reply: "AI is currently unavailable. Try again later.",
    });
  }
}