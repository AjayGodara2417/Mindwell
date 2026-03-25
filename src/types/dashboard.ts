export interface Assessment {
  id: number;
  score: number;
  created_at: string;
}

export interface SleepEntry {
  id: number;
  hours: number;
  created_at?: string;
  date?: string;
  timestamp?: string;
}

export enum TaskType {
  Weekly = "weekly",
  Daily = "daily",
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  type: TaskType;
  created_at?: string;
  due_date?: string;
  date?: string;
}

export interface Profile {
  email: string;
  full_name?: string;
}

export interface AssessmentResponse {
  success: boolean;
  history: Assessment[];
}

export interface SleepResponse {
  success: boolean;
  data: SleepEntry[];
}

export type IntervalRef = ReturnType<typeof setInterval> | null;