import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, hours } = await req.json();

    await db.execute(
      "INSERT INTO sleep_logs (user_email, hours) VALUES (?, ?)",
      [email, hours]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const [rows]: any = await db.execute(
    "SELECT * FROM sleep_logs WHERE user_email = ? ORDER BY created_at ASC",
    [email]
  );

  return NextResponse.json({ success: true, data: rows });
}