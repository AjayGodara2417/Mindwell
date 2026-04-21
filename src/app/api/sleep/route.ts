import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, hours } = await req.json();

    if (!email || !hours) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // 🧠 Same logic as frontend (before 6 AM = previous day)
    const now = new Date();
    if (now.getHours() < 6) {
      now.setDate(now.getDate() - 1);
    }

    const logDate = now.toISOString().split("T")[0];

    // ✅ UPSERT (best for Aiven)
    await db.execute(
      `
      INSERT INTO sleep_logs (user_email, hours, log_date)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        hours = VALUES(hours)
      `,
      [email, hours, logDate]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Sleep POST error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `
      SELECT user_email, hours, log_date as created_at
      FROM sleep_logs
      WHERE user_email = ?
      ORDER BY log_date ASC
      `,
      [email]
    );

    return NextResponse.json({ success: true, data: rows });

  } catch (err) {
    console.error("Sleep GET error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}