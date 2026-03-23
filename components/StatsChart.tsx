"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 28 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 70 },
];

export default function StatsChart() {
  return (
    <motion.div
      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-900">
          Weekly Progress
        </h3>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#9ca3af" />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#4f46e5"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}