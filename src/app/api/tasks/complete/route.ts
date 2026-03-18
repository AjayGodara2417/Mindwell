import { NextResponse } from "next/server";
import db  from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, completed, email } = body;

    // Get current task state
    const [rows]: any = await db.query(
      "SELECT completed FROM planner_tasks WHERE id = ?",
      [id]
    );

    const alreadyCompleted = rows[0]?.completed;

    // Update task
    await db.query(
      "UPDATE planner_tasks SET completed = ? WHERE id = ?",
      [completed, id]
    );

    // Give reward ONLY once
    if (!alreadyCompleted && completed) {
      await db.query(
        `UPDATE patients 
         SET points = points + 2,
             tasks_completed = tasks_completed + 1
         WHERE email = ?`,
        [email]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}