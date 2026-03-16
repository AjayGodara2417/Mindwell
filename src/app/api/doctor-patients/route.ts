import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get("doctor_id");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@QAZajay2417$",
      database: "mindwell",
    });

    const [patients]: any = await db.execute(
      "SELECT id, full_name, email, symptoms FROM patients WHERE linked_doctor_id=?",
      [doctor_id]
    );

    return NextResponse.json({
      success: true,
      patients,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Error fetching patients",
    });
  }
}