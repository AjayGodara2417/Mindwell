import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    await db.query(
      "UPDATE users SET fcm_token = ? WHERE email = ?",
      [token, email]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false });
  }
}