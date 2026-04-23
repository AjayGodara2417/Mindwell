"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [role, setRole] = useState<"patient" | "doctor">("patient");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    doctorId: "",
    speciality: "",
    symptoms: [] as string[],
    password: "",
    confirmPassword: "",
  });

  const symptomsList = ["Anxiety", "Depression", "Stress"];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSymptom = (symptom: string) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, ...form }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  // Save user data
  localStorage.setItem("token", data.token);
  localStorage.setItem("userName", data.name);
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userRole", data.role);

  alert("Account created successfully");

  // Redirect based on role
  if (data.role === "doctor") {
    router.push("/login");
  } else {
    router.push("/login");
  }
};

  return (
  <div className="max-h-11/12 lg:pt-15 flex items-center justify-center bg-gray-50 px-4 pt-4">
    
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8 space-y-2">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Start your wellness journey
        </p>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setRole("patient")}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            role === "patient"
              ? "bg-[#2f5d50] text-white shadow-sm"
              : "text-gray-600"
          }`}
        >
          Patient
        </button>

        <button
          type="button"
          onClick={() => setRole("doctor")}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            role === "doctor"
              ? "bg-[#2f5d50] text-white shadow-sm"
              : "text-gray-600"
          }`}
        >
          Doctor
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Doctor Fields */}
        {role === "doctor" && (
          <>
            <div>
              <label className="text-sm text-gray-600">Doctor ID</label>
              <input
                type="text"
                required
                value={form.doctorId}
                onChange={(e) =>
                  handleChange("doctorId", e.target.value)
                }
                className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Speciality (optional)
              </label>
              <input
                type="text"
                value={form.speciality}
                onChange={(e) =>
                  handleChange("speciality", e.target.value)
                }
                className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
              />
            </div>
          </>
        )}

        {/* Patient Symptoms */}
        {role === "patient" && (
          <div>
            <label className="text-sm text-gray-600">Symptoms</label>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {symptomsList.map((symptom) => {
                const active = form.symptoms.includes(symptom);

                return (
                  <button
                    type="button"
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`text-sm px-3 py-2 rounded-xl border transition ${
                      active
                        ? "bg-[#2f5d50] text-white border-[#2f5d50]"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Button */}
        <button className="w-full bg-[#2f5d50] text-white py-2.5 rounded-xl hover:opacity-90 transition">
          Sign Up
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-[#2f5d50] font-medium">
          Login
        </a>
      </p>

    </div>
  </div>
);
}