import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    // console.log("working")
    const { doctor_id, patient_email } = await req.json();

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), // IMPORTANT
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false, // or use CA cert (recommended)
      },
    });

    // Check doctor exists
    const [doctor] = await db.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM doctors WHERE doctor_id=?",
      [doctor_id]
    );

    if (doctor.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Doctor ID not found",
      });
    }

    // Update patient
    await db.execute(
      "UPDATE patients SET linked_doctor_id=? WHERE email=?",
      [doctor_id, patient_email]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
