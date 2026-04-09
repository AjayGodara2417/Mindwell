import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const message = body.message;
  const userData = body.userData || {}; // ✅ fallback

  const systemPrompt = `
You are a mental health assistant.

User Data:
- Score: ${userData.score ?? "unknown"}
- Severity: ${userData.severity ?? "unknown"}
- Sleep Avg: ${userData.sleepAvg ?? "unknown"}
- Weight Trend: ${userData.weightTrend ?? "unknown"}
- Mood: ${userData.mood ?? "unknown"}

User Question:
${message}

Give a helpful, supportive answer based on the data.
`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json({ reply: "Error occurred" });
  }
}