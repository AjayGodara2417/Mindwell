import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {

    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "All fields required"
      });
    }

    /* -------- Check Doctor First -------- */

    const [doctorRows]: any = await db.query(
      "SELECT * FROM doctors WHERE email=?",
      [email]
    );

    if (doctorRows.length > 0) {

      const doctor = doctorRows[0];

      const valid = await bcrypt.compare(oldPassword, doctor.password);

      if (!valid) {
        return NextResponse.json({
          success: false,
          message: "Old password incorrect"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query(
        "UPDATE doctors SET password=? WHERE email=?",
        [hashedPassword, email]
      );

      return NextResponse.json({
        success: true,
        message: "Password updated"
      });
    }

    /* -------- Check Patient -------- */

    const [patientRows]: any = await db.query(
      "SELECT * FROM patients WHERE email=?",
      [email]
    );

    if (patientRows.length > 0) {

      const patient = patientRows[0];

      const valid = await bcrypt.compare(oldPassword, patient.password);

      if (!valid) {
        return NextResponse.json({
          success: false,
          message: "Old password incorrect"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query(
        "UPDATE patients SET password=? WHERE email=?",
        [hashedPassword, email]
      );

      return NextResponse.json({
        success: true,
        message: "Password updated"
      });
    }

    return NextResponse.json({
      success: false,
      message: "User not found"
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Password update failed"
    });
  }
}