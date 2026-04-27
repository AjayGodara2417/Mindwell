import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { email, doctor_id } = await req.json();

    if (!email || !doctor_id) {
      return NextResponse.json({
        success: false,
        message: "Email and Doctor ID are required",
      });
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

    // ✅ Check if patient exists
    const [rows]: any = await db.execute(
      "SELECT * FROM patients WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Patient not found",
      });
    }

    const patient = rows[0];

    // ✅ Check if already linked
    if (patient.linked_doctor_id) {
      return NextResponse.json({
        success: false,
        message: "Patient already assigned to a doctor",
      });
    }

    // ✅ Update doctor link
    await db.execute(
      "UPDATE patients SET linked_doctor_id = ? WHERE email = ?",
      [doctor_id, email]
    );

    return NextResponse.json({
      success: true,
      patient,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}