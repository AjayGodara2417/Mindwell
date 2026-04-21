import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  const [rows]: any = await db.execute(
    `SELECT * FROM cognitive_tests 
     WHERE email = ? 
     ORDER BY created_at ASC`,
    [email]
  );

  return NextResponse.json({ tests: rows });
}