import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, reminder_datetime, medicine_name } = await req.json();

    if (!email || !reminder_datetime || !medicine_name) {
      return Response.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Store exact datetime received from frontend
    const mysqlTime = reminder_datetime
      .replace("T", " ")
      .slice(0, 19);

    await db.query(
      "INSERT INTO reminders (email, medicine_name, reminder_datetime) VALUES (?, ?, ?)",
      [email, medicine_name, mysqlTime]
    );

    return Response.json({ success: true });

  } catch (err: any) {
    console.error("🔥 Reminder API error:", err);

    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}