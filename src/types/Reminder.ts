// types/Reminder.ts

export interface Reminder {
  id?: number;
  email: string;
  medicine_name: string;
  reminder_datetime: string; // ISO string
  created_at?: string;
}