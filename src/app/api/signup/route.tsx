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
    if (role === "doctor") {
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
    if (role === "patient") {
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