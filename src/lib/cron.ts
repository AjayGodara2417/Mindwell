// import admin from "@/lib/firebaseAdmin";
import db from "@/lib/db";
import moment from "moment";

export function startReminderCron() {
  setInterval(async () => {
    try {
      const now = moment.utc().format("YYYY-MM-DD HH:mm:59");

      const [rows]: any = await db.query(
        `SELECT r.*, u.fcm_token 
         FROM reminders r
         JOIN users u ON r.email = u.email
         WHERE r.reminder_datetime <= ?
         AND r.notified = 0`,
        [now]
      );

      for (const r of rows) {
        if (!r.fcm_token) continue;

        // await admin.messaging().send({
        //   token: r.fcm_token,
        //   notification: {
        //     title: "Medicine Reminder 💊",
        //     body: `Take ${r.medicine_name}`,
        //   },
        // });

        await db.query(
          "UPDATE reminders SET notified = 1 WHERE id = ?",
          [r.id]
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, 60000);
}
