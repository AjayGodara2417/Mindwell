import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sub = await req.json();

  await db.query(
    "INSERT INTO subscriptions (data) VALUES (?)",
    [JSON.stringify(sub)]
  );

  return Response.json({ success: true });
}