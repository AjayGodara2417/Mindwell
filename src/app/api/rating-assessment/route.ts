import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, mood, energy, stress } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO rating_assessments
       (patient_email, mood, energy, stress)
       VALUES (?, ?, ?, ?)`,
      [email, mood, energy, stress]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Rating Error:", error);
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
        { success: false },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `SELECT * FROM rating_assessments
       WHERE patient_email = ?
       ORDER BY created_at ASC`,
      [email]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error("Rating Fetch Error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}