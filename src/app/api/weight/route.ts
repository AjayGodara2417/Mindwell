import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// SAVE WEIGHT
export async function POST(req: NextRequest) {
  try {
    const { email, weight } = await req.json();

    await db.execute(
      "INSERT INTO weight_logs (user_email, weight) VALUES (?, ?)",
      [email, weight]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}

// GET WEIGHT HISTORY
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const [rows]: any = await db.execute(
    "SELECT * FROM weight_logs WHERE user_email = ? ORDER BY created_at ASC",
    [email]
  );

  return NextResponse.json({ success: true, data: rows });
}