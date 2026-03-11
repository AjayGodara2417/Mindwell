import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { SignupRequest } from "@/types/user";

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

    if (role === "doctor") {
      await db.query(
        `INSERT INTO doctors (full_name,email,doctor_id,speciality,password)
         VALUES (?,?,?,?,?)`,
        [fullName, email, doctorId, speciality || null, hashedPassword]
      );
    }

    if (role === "patient") {
      await db.query(
        `INSERT INTO patients (full_name,email,symptoms,password)
         VALUES (?,?,?,?)`,
        [fullName, email, symptoms?.join(",") || "", hashedPassword]
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}