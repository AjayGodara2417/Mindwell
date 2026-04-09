import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      score,
      percentage,
      severity,
      memoryLevel,
      memoryScore,
      illness,
      thoughts,
      financial,
      moodText,
      moodScore,
      energy,
      stress,
    } = await req.json();

    // 🔒 Prevent duplicate submission (VERY IMPORTANT)
    const [existing]: any = await db.query(
      `SELECT * FROM assessments 
       WHERE patient_email = ? 
       AND DATE(created_at) = CURDATE()`,
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already submitted today" });
    }

    // 🔥 INSERT INTO ALL TABLES

    // 1. assessments
    await db.query(
      `INSERT INTO assessments 
      (patient_email, score, percentage, severity)
      VALUES (?, ?, ?, ?)`,
      [email, score, percentage, severity]
    );

    // 2. memory
    await db.query(
      `INSERT INTO memory_assessments 
      (patient_email, level, score)
      VALUES (?, ?, ?)`,
      [email, memoryLevel, memoryScore]
    );

    // 3. subjective
    await db.query(
      `INSERT INTO subjective_assessments 
      (patient_email, illness, thoughts, financial_stress, mood)
      VALUES (?, ?, ?, ?, ?)`,
      [email, illness, thoughts, financial, moodText]
    );

    // 4. rating
    await db.query(
      `INSERT INTO rating_assessments 
      (patient_email, mood, energy, stress)
      VALUES (?, ?, ?, ?)`,
      [email, moodScore, energy, stress]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}