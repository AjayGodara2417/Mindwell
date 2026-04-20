"use client";

import { motion } from "framer-motion";

export default function TestLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-4">{children}</div>
      </motion.div>
    </div>
  );
}