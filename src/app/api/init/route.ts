import { startReminderCron } from "@/lib/cron";

let started = false;

export async function GET() {
  if (!started) {
    startReminderCron();
    started = true;
    console.log("✅ Cron started");
  }

  return Response.json({ success: true });
}