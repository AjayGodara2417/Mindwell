import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/* ---------------- SAVE NEW ASSESSMENT ---------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      score,
      emotion,
      emotion_score,
      final_score,
      severity,
      recommendations,
      diet,
      consult_doctor
    } = body;

    if (!email || score === undefined) {
      return NextResponse.json(
        { success: false, message: "Email and score are required" },
        { status: 400 }
      );
    }

    /* 🔥 DAILY LIMIT CHECK */
    const [existing]: any = await db.query(
      `SELECT id FROM assessments 
       WHERE patient_email = ? 
       AND DATE(created_at) = CURDATE()`,
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already completed today's assessment.",
        },
        { status: 400 }
      );
    }

    /* Calculate percentage */
    const percentage = Math.round((score / 75) * 100);

    /* INSERT INTO DB (🔥 FIXED) */
    const [result]: any = await db.query(
      `INSERT INTO assessments 
      (patient_email, score, percentage, emotion, emotion_score, final_score, severity, recommendations, diet, consult_doctor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        score,
        percentage,
        emotion || "unknown",
        emotion_score || 0,
        final_score || 0,
        severity || "Unknown",
        JSON.stringify(recommendations || []),   // ✅ FIX
        JSON.stringify(diet || []),              // ✅ FIX
        consult_doctor ? 1 : 0                   // ✅ FIX
      ]
    );

    return NextResponse.json({
      success: true,
      assessment: {
        id: result.insertId,
        email,
        score,
        percentage,
        severity,
        emotion_score,
        final_score,
        emotion,
        recommendations,
        diet,
        consult_doctor
      },
    });

  } catch (error) {
    console.error("Assessment Save Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save assessment" },
      { status: 500 }
    );
  }
}

/* ---------------- FETCH USER HISTORY ---------------- */

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `SELECT 
        score,
        severity,
        percentage,
        emotion_score,
        final_score,
        emotion,
        recommendations,
        diet,
        consult_doctor,
        created_at
       FROM assessments
       WHERE patient_email = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [email]
    );

    /* 🔥 PARSE JSON FIELDS */
    const history = Array.isArray(rows)
      ? rows.map((row: any) => ({
          ...row,
          recommendations: row.recommendations
            ? JSON.parse(row.recommendations)
            : [],
          diet: row.diet ? JSON.parse(row.diet) : [],
          consult_doctor: !!row.consult_doctor,
        }))
      : [];

    return NextResponse.json({
      success: true,
      history,
    });

  } catch (error) {
    console.error("Assessment Fetch Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}