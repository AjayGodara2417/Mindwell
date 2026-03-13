import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {

    const { email, score } = await req.json();

    const percentage = (score / 75) * 100;

    let severity = "";

    if (score <= 15) severity = "Minimal";
    else if (score <= 30) severity = "Mild";
    else if (score <= 45) severity = "Moderate";
    else if (score <= 60) severity = "Severe";
    else severity = "Very Severe";

    await db.query(
      `INSERT INTO assessments
      (patient_email, score, percentage, severity)
      VALUES (?,?,?,?)`,
      [email, score, percentage, severity]
    );

    return NextResponse.json({
      success: true,
      score,
      percentage,
      severity
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }
}