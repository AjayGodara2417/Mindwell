import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get("doctor_id");

    if (!doctor_id) {
      return NextResponse.json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), // ⚠️ REQUIRED for Aiven
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
        // ca: fs.readFileSync("./ca.pem"), // ⚠️ Aiven CA certificate
      },
    });

    const [patients] = await db.execute(
      "SELECT id, full_name, email, symptoms FROM patients WHERE linked_doctor_id = ?",
      [doctor_id]
    );

    return NextResponse.json({
      success: true,
      patients,
    });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}