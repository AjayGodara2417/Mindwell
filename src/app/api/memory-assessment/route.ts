import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, level, score } = await req.json();

    if (!email || level === undefined || score === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `INSERT INTO memory_assessments 
       (patient_email, level, score)
       VALUES (?, ?, ?)`,
      [email, level, score]
    );

    return NextResponse.json({
      success: true,
      memory: {
        id: result.insertId,
        email,
        level,
        score,
      },
    });

  } catch (error) {
    console.error("Memory Save Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save memory score" },
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
      `SELECT * FROM memory_assessments 
       WHERE patient_email = ? 
       ORDER BY created_at ASC`,
      [email]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error("Memory Fetch Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch memory data" },
      { status: 500 }
    );
  }
}