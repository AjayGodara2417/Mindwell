"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [role, setRole] = useState("patient");
  const router = useRouter();

  const handleLogin = (e: unknown) => {
    e.preventDefault();

    // later you will add authentication here

    router.push("/dashboard");
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
            className={`py-2 rounded-lg text-sm font-medium ${
              role === "patient"
                ? "bg-blue-600 text-white shadow"
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
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {role === "doctor" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}