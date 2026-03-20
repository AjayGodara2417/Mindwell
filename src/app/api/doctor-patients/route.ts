import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get("doctor_id");

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [patients] = await db.execute<mysql.RowDataPacket[]>(
      "SELECT id, full_name, email, symptoms FROM patients WHERE linked_doctor_id=?",
      [doctor_id]
    );

    return NextResponse.json({
      success: true,
      patients,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Error fetching patients",
    });
  }
}