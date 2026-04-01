import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, illness, thoughts, financial, mood } =
      await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO subjective_assessments
       (patient_email, illness, thoughts, financial_stress, mood)
       VALUES (?, ?, ?, ?, ?)`,
      [email, illness, thoughts, financial, mood]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Subjective Save Error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

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
      `SELECT * FROM subjective_assessments 
       WHERE patient_email = ?
       ORDER BY created_at DESC`,
      [email]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Subjective Fetch Error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}