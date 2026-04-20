import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔥 Create DB connection (Aiven MySQL)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // required for Aiven
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      memory,
      reaction,
      attention,
      digit,
      stroop,
      totalScore,
    } = body;

    // ✅ Basic validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // optional: ensure numbers
    const safeData = {
      memory: Number(memory) || 0,
      reaction: Number(reaction) || 0,
      attention: Number(attention) || 0,
      digit: Number(digit) || 0,
      stroop: Number(stroop) || 0,
      totalScore: Number(totalScore) || 0,
    };

    const today = new Date().toISOString().split("T")[0];

    const conn = await pool.getConnection();

    try {
      // 🔒 OPTIONAL: prevent duplicate submission per day
      const [existing]: any = await conn.query(
        `SELECT id FROM cognitive_results 
         WHERE email = ? AND DATE(created_at) = ?`,
        [email, today]
      );

      if (existing.length > 0) {
        return NextResponse.json({
          success: false,
          message: "Already submitted today",
        });
      }

      // ✅ INSERT DATA
      await conn.query(
        `INSERT INTO cognitive_results
        (email, memory, reaction, attention, digit, stroop, total_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          safeData.memory,
          safeData.reaction,
          safeData.attention,
          safeData.digit,
          safeData.stroop,
          safeData.totalScore,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Cognitive result saved",
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Cognitive API Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}