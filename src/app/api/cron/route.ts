import { NextResponse } from "next/server";
import { startReminderCron } from "@/lib/reminderCron";

let started = false;

export async function GET() {
  if (!started) {
    startReminderCron();
    started = true;
  }

  return NextResponse.json({ message: "Cron started" });
}