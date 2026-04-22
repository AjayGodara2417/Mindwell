"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [doctor_id, setDoctor_id] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, email, password }), // ✅ ADD ROLE
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userName", data.name);
  localStorage.setItem("userRole", data.role);

  if (data.role === "doctor") {
    localStorage.setItem("doctorId", data.doctor_id);
    router.push("/doctor-dashboard");
  } else {
    router.push("/dashboard");
  }
};

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 space-y-6">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Login to continue your journey
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
      <form onSubmit={handleLogin} className="space-y-4">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Doctor ID */}
        {/* <div>
          <label className="text-sm text-gray-600">Doctor ID</label>
          <input
            type="text"
            required
            value={doctor_id}
            onChange={(e) => setDoctor_id(e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div> */}

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#2f5d50] text-white py-2.5 rounded-xl hover:opacity-90 transition"
        >
          Login
        </button>

      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <a href="/signup" className="text-[#2f5d50] font-medium">
          Sign up
        </a>
      </p>

    </div>
  </div>
);
}