import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const [rows]: any = await db.query(
      "SELECT points, tasks_completed FROM patients WHERE email = ?",
      [email]
    );

    return NextResponse.json(rows[0] || {});
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}