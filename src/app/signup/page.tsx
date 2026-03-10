"use client";

import { useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("patient");

  const symptoms = ["Anxiety", "Depression", "Stress", "Other"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Title */}
        <h1 className="text-2xl text-black font-bold text-center mb-6">
          Create Account
        </h1>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRole("patient")}
            className={`py-2 rounded-lg text-sm font-medium transition ${
              role === "patient"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Patient
          </button>

          <button
            onClick={() => setRole("doctor")}
            className={`py-2 rounded-lg text-sm font-medium transition ${
              role === "doctor"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="john@email.com"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Doctor Fields */}
          {role === "doctor" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Doctor ID
                </label>
                <input
                  type="text"
                  placeholder="DOC12345"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {/* Patient Fields */}
          {role === "patient" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Symptoms
              </label>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom}
                    className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input type="checkbox" />
                    <span className="text-sm text-black">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
            Sign Up
          </button>

        </form>

        {/* Login link */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}