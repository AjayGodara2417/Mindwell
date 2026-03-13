import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, SECRET);

    const userId = decoded.id;
    const role = decoded.role;

    let rows: any;

    if (role === "patient") {
      [rows] = await db.query(
        "SELECT id, full_name, email FROM patients WHERE id=?",
        [userId]
      );
    } else {
      [rows] = await db.query(
        "SELECT id, full_name, email, speciality FROM doctors WHERE id=?",
        [userId]
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}