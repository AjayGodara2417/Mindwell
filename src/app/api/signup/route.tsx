import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { SignupRequest } from "@/types/user";

const SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body: SignupRequest = await req.json();

    const {
      role,
      fullName,
      email,
      doctorId,
      speciality,
      symptoms,
      password,
    } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // -------- Doctor Signup --------
    // -------- Doctor Signup --------
    if (role === "doctor") {
      // ✅ Check if doctor_id already exists
      const [existingDoctor]: any = await db.query(
        "SELECT id FROM doctors WHERE doctor_id = ?",
        [doctorId]
      );

      if (existingDoctor.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Doctor ID already exists. Please choose a unique ID.",
          },
          { status: 400 }
        );
      }

      // ✅ (Optional) Check if email already exists
      const [existingEmail]: any = await db.query(
        "SELECT id FROM doctors WHERE email = ?",
        [email]
      );

      if (existingEmail.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already registered as a doctor.",
          },
          { status: 400 }
        );
      }

      // ✅ Insert doctor
      const [result]: any = await db.query(
        `INSERT INTO doctors (full_name,email,doctor_id,speciality,password)
     VALUES (?,?,?,?,?)`,
        [fullName, email, doctorId, speciality || null, hashedPassword]
      );

      const token = jwt.sign(
        { id: result.insertId, role: "doctor" },
        SECRET
      );

      return NextResponse.json({
        role: "doctor",
        token,
        name: fullName,
        email: email,
      });
    }

    // -------- Patient Signup --------
    // -------- Patient Signup --------
    if (role === "patient") {
      const [existingPatient]: any = await db.query(
        "SELECT id FROM patients WHERE email = ?",
        [email]
      );

      if (existingPatient.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already registered.",
          },
          { status: 400 }
        );
      }

      const [result]: any = await db.query(
        `INSERT INTO patients (full_name,email,symptoms,password)
     VALUES (?,?,?,?)`,
        [fullName, email, symptoms?.join(",") || "", hashedPassword]
      );

      const token = jwt.sign(
        { id: result.insertId, role: "patient" },
        SECRET
      );

      return NextResponse.json({
        role: "patient",
        token,
        name: fullName,
        email: email,
      });
    }

    return NextResponse.json(
      { message: "Invalid role" },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}