import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest } from "@/types/user";

const SECRET = "SUPER_SECRET_KEY";

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();

    const { email, password } = body;

    // check doctor
    const [doctorRows]: any = await db.query(
      "SELECT * FROM doctors WHERE email=?",
      [email]
    );

    if (doctorRows.length > 0) {
      const doctor = doctorRows[0];

      const valid = await bcrypt.compare(password, doctor.password);

      if (!valid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: doctor.id, role: "doctor" },
        SECRET
      );

      return NextResponse.json({
        role: "doctor",
        token,
      });
    }

    // check patient
    const [patientRows]: any = await db.query(
      "SELECT * FROM patients WHERE email=?",
      [email]
    );

    if (patientRows.length > 0) {
      const patient = patientRows[0];

      const valid = await bcrypt.compare(password, patient.password);

      if (!valid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: patient.id, role: "patient" },
        SECRET
      );

      return NextResponse.json({
        role: "patient",
        token,
      });
    }

    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}