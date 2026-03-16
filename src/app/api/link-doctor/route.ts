import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    // console.log("working")
    const { doctor_id, patient_email } = await req.json();

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@QAZajay2417$",
      database: "mindwell",
    });

    // Check doctor exists
    const [doctor]: any = await db.execute(
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
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}