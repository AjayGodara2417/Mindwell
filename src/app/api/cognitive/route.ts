import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { CognitiveTestPayload } from "@/types/cognitive";

export async function POST(req: NextRequest) {
  const body: CognitiveTestPayload = await req.json();

  const { patient_id, test_type, score, accuracy, response_time } = body;

  await db.query(
    "INSERT INTO cognitive_tests (patient_id, test_type, score, accuracy, response_time) VALUES (?, ?, ?, ?, ?)",
    [
      patient_id,
      test_type,
      score ?? 0,
      accuracy ?? 0,
      response_time ?? 0,
    ]
  );

  return NextResponse.json({ success: true });
}