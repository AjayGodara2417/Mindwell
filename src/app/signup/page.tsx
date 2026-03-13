"use client";

import { useState } from "react";

export default function Signup() {
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

  const symptomsList = ["Anxiety", "Depression", "Stress", "Other"];

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

    alert("Account created successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        <h1 className="text-2xl text-black font-bold text-center mb-6">
          Create Account
        </h1>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`py-2 rounded-lg text-sm font-medium ${
              role === "patient"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Patient
          </button>

          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`py-2 rounded-lg text-sm font-medium ${
              role === "doctor"
                ? "bg-blue-600 text-white"
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
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* Doctor Fields */}
          {role === "doctor" && (
            <>
              <div>
                <label className="text-sm text-gray-700">Doctor ID</label>
                <input
                  type="text"
                  required
                  value={form.doctorId}
                  onChange={(e) =>
                    handleChange("doctorId", e.target.value)
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">
                  Speciality (optional)
                </label>
                <input
                  type="text"
                  value={form.speciality}
                  onChange={(e) =>
                    handleChange("speciality", e.target.value)
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}

          {/* Patient Symptoms */}
          {role === "patient" && (
            <div>
              <label className="text-sm text-gray-700">Symptoms</label>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {symptomsList.map((symptom) => (
                  <label
                    key={symptom}
                    className="flex items-center gap-2 border p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={form.symptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                    />
                    <span className="text-black text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}