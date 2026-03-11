export type Role = "doctor" | "patient";

export interface SignupRequest {
  role: Role;
  fullName: string;
  email: string;
  doctorId?: string;
  speciality?: string;
  symptoms?: string[];
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}