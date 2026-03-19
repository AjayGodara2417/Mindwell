export async function PUT(req: Request) {
  const { id, completed, email } = await req.json();

  await db.query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, id]
  );

  // Give reward ONLY when marking complete
  if (completed) {
    await db.query(
      "UPDATE users SET points = points + 2, tasks_completed = tasks_completed + 1 WHERE email = ?",
      [email]
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query("DELETE FROM tasks WHERE id = ?", [id]);

  return NextResponse.json({ success: true });
}