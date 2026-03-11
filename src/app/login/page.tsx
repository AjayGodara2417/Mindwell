"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay for UX feedback
    setTimeout(() => {
      setIsLoading(false);
      // Your logic here...
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 antialiased">
      {/* Background soft glow (CSS only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MindWell</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        {/* CSS-Only Sliding Role Tab */}
        <div className="relative flex bg-gray-100 rounded-2xl p-1 mb-8">
          {/* The Slider Background */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
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

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot?</a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            <div className={`flex items-center justify-center transition-all duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>
              Login to Account
            </div>
            
            {/* Simple CSS Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Join MindWell
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}