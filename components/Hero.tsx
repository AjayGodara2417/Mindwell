"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-400/20 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            YOUR SAFE SPACE
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Build a calmer,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
              healthier mind
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-lg">
            Track emotions, gain insights, and connect with experts — all in one peaceful digital space.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
              Start Journey →
            </button>

            <button className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
              Take Tour
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border">
            <Image
              src="/hero-image.jpg"
              alt="Mental wellness"
              width={500}
              height={400}
            />
          </div>

          {/* Floating Card */}
          <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg text-sm">
            ❤️ 1,240+ users improving daily
          </div>
        </motion.div>

      </div>
    </section>
  );
}