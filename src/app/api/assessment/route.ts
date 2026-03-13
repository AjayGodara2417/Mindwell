import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/* ---------------- SAVE NEW ASSESSMENT ---------------- */

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { email, score } = body;

    if (!email || score === undefined) {
      return NextResponse.json(
        { success: false, message: "Email and score are required" },
        { status: 400 }
      );
    }

    /* Calculate percentage */
    const percentage = Math.round((score / 75) * 100);

    /* Determine severity */
    let severity = "";

    if (score <= 15) severity = "Minimal";
    else if (score <= 30) severity = "Mild";
    else if (score <= 45) severity = "Moderate";
    else if (score <= 60) severity = "Severe";
    else severity = "Very Severe";

    /* Insert into DB */

    const [result]: any = await db.query(
      `INSERT INTO assessments 
       (patient_email, score, percentage, severity)
       VALUES (?,?,?,?)`,
      [email, score, percentage, severity]
    );

    return NextResponse.json({
      success: true,
      assessment: {
        id: result.insertId,
        email,
        score,
        percentage,
        severity
      }
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

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `SELECT 
        score,
        percentage,
        severity,
        created_at
       FROM assessments
       WHERE patient_email = ?
       ORDER BY created_at ASC
       LIMIT 10`,
      [email]
    );

    return NextResponse.json({
      success: true,
      history: rows
    });

  } catch (error) {

    console.error("Assessment Fetch Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch assessments" },
      { status: 500 }
    );

  }
}