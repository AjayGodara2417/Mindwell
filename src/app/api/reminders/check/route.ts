import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const [rows]: any = await db.query(
    `SELECT * FROM reminders 
     WHERE email = ? AND notified = 1`,
    [email]
  );

  return Response.json({ reminders: rows });
}