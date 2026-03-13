import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {

  const email = req.nextUrl.searchParams.get("email");

  const [rows]: any = await db.query(
    "SELECT * FROM assessments WHERE patient_email=? ORDER BY created_at DESC",
    [email]
  );

  return NextResponse.json(rows);
}