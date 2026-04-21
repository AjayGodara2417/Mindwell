import { NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      test_type,
      score,
      accuracy,
      avg_reaction_time,
    } = body;

    // ✅ Validation
    if (!email || !test_type || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    await db.execute(
      `INSERT INTO cognitive_tests 
      (id, email, test_type, score, accuracy, avg_reaction_time) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        email,
        test_type,
        Number(score),
        Number(accuracy) || 0,
        Number(avg_reaction_time) || 0,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB ERROR:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}