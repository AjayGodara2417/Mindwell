import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET TASKS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const [rows]: any = await db.query(
      "SELECT * FROM planner_tasks WHERE patient_email = ? ORDER BY created_at DESC",
      [email]
    );

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// ADD TASK
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, text, type } = body;

    await db.query(
      "INSERT INTO planner_tasks (patient_email, text, type) VALUES (?, ?, ?)",
      [email, text, type]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// DELETE TASK
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    await db.query("DELETE FROM planner_tasks WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}