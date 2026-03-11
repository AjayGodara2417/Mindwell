"use client";

import { useState } from "react";

export default function Signup() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [isLoading, setIsLoading] = useState(false);
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
    setForm((prev) => ({ ...prev, [field]: value }));
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
    setIsLoading(true);
    
    // API logic remains the same
    setTimeout(() => setIsLoading(false), 1500); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 antialiased relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join MindWell and start your wellness journey.</p>
        </div>

        {/* Sliding Role Tab */}
        <div className="relative flex bg-gray-100 rounded-2xl p-1 mb-8">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              role === "doctor" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              role === "patient" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              role === "doctor" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Conditional Role Section */}
          <div className="transition-all duration-300">
            {role === "doctor" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Doctor ID</label>
                  <input
                    type="text"
                    required
                    value={form.doctorId}
                    onChange={(e) => handleChange("doctorId", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Speciality</label>
                  <input
                    type="text"
                    value={form.speciality}
                    onChange={(e) => handleChange("speciality", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                    placeholder="e.g. Psychology"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">What brings you here?</label>
                <div className="grid grid-cols-2 gap-2">
                  {symptomsList.map((symptom) => {
                    const isSelected = form.symptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          isSelected 
                            ? "bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500/10" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}