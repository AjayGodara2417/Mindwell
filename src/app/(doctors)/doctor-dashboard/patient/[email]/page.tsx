"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Assessment = {
  score: number;
  percentage: number;
  severity: string;
  created_at: string;
  date?: string;
  index?: number;
};

type Sleep = {
  hours: number;
  created_at: string;
  date?: string;
  index?: number;
};

export default function PatientDetails() {
  const { email } = useParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sleepData, setSleepData] = useState<Sleep[]>([]);

  const fetchSleep = async () => {
    const res = await fetch(`/api/sleep?email=${email}`);
    const data = await res.json();

    if (data.success) {
      const formatted = data.data
        .sort(
          (a: Sleep, b: Sleep) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((s: Sleep, i: number) => ({
          ...s,
          date: new Date(s.created_at).toLocaleDateString(),
          index: i + 1,
        }));

      setSleepData(formatted);
    }
  };

  useEffect(() => {
    fetchSleep();   // 👈 ADD THIS
  }, [email]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const res = await fetch(`/api/assessment?email=${email}`);
      const data = await res.json();

      if (data.success) {

        const formatted = data.history
          .sort(
            (a: Assessment, b: Assessment) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .map((a: Assessment, i: number) => ({
            ...a,
            date: new Date(a.created_at).toLocaleDateString(),
            index: i + 1,
          }));

        setAssessments(formatted);
      }

      setLoading(false);
    };

    fetchAssessments();
  }, [email]);

  const lastFive = assessments.slice(-5);
  const latest = assessments[assessments.length - 1];

  /* ----------- Tooltip ----------- */

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white border rounded-lg shadow p-3 text-sm">
          <p className="font-semibold">{data.date}</p>
          <p>Score: {data.score}</p>
          <p>Percentage: {data.percentage}%</p>
          <p>Severity: {data.severity}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!assessments.length) return <div className="p-8">No data</div>;

  return (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-10">

    {/* Header */}
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Patient Analytics Dashboard
      </h1>
      <p className="text-gray-500 mt-1">
        Track mental health and sleep patterns over time
      </p>
    </div>

    {/* ===== TOP SECTION ===== */}
    <div className="grid md:grid-cols-2 gap-8 mb-12">

      {/* Recent Assessments */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Assessments: Last five days
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={lastFive}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="index" tick={{ fill: "#6b7280" }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.15}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

      {/* Recent Sleep */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Sleep: Last five days
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={sleepData.slice(-5)}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="index" tick={{ fill: "#6b7280" }} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>

    {/* ===== MIDDLE SECTION ===== */}
    <div className="grid md:grid-cols-2 gap-8 mb-12">

      {/* Percentage Trend */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Assessment Percentage
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={assessments}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="index" tick={{ fill: "#6b7280" }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Score Comparison */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Assessment Score
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={assessments}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="index" tick={{ fill: "#6b7280" }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>

    {/* ===== BOTTOM SECTION ===== */}
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Sleep Duration complete report
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sleepData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="index" tick={{ fill: "#6b7280" }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>

  </div>
);
}