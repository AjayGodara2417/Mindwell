import cron from "node-cron";
import db from "@/lib/db";

export const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const formatted =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0") + " " +
      String(now.getHours()).padStart(2, "0") + ":" +
      String(now.getMinutes()).padStart(2, "0") + ":00";

    try {
      const [rows]: any = await db.query(
        "SELECT * FROM reminders WHERE reminder_datetime = ?",
        [formatted]
      );

      if (rows.length > 0) {
        console.log("⏰ Reminder triggered:", rows);
        // Later: send push / socket / email
      }
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};