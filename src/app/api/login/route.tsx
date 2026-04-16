import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest } from "@/types/user";

const SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // ---------------- DOCTOR LOGIN ----------------
    if (role === "doctor") {
      const [rows]: any = await db.query(
        "SELECT * FROM doctors WHERE email=?",
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { message: "Doctor not found" },
          { status: 404 }
        );
      }

      const doctor = rows[0];

      const valid = await bcrypt.compare(password, doctor.password);

      if (!valid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: doctor.id, role: "doctor" },
        SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        success: true,
        role: "doctor",
        token,
        name: doctor.full_name,
        email: doctor.email,
        doctor_id: doctor.doctor_id,
      });
    }

    // ---------------- PATIENT LOGIN ----------------
    if (role === "patient") {
      const [rows]: any = await db.query(
        "SELECT * FROM patients WHERE email=?",
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { message: "Patient not found" },
          { status: 404 }
        );
      }

      const patient = rows[0];

      const valid = await bcrypt.compare(password, patient.password);

      if (!valid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: patient.id, role: "patient" },
        SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        success: true,
        role: "patient",
        token,
        name: patient.full_name,
        email: patient.email,
      });
    }

    // ---------------- INVALID ROLE ----------------
    return NextResponse.json(
      { message: "Invalid role selected" },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}