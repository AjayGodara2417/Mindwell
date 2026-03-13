"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.role === "doctor") {
      router.push("/doctor-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-bold text-black text-center mb-6">
          Login to MindWell
        </h1>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`py-2 rounded-lg text-sm ${
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
            className={`py-2 rounded-lg text-sm ${
              role === "doctor"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}