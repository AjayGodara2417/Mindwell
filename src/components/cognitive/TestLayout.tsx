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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </motion.div>
    </div>
  );
}