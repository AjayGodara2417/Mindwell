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

export default function PatientDetails() {
  const { email } = useParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-2xl font-bold mb-10">
        Patient Assessment Analytics
      </h1>

      {/* -------- Last 5 Chart (Half Width) -------- */}

      <div className="flex justify-center mb-12">

        <div className="bg-white shadow rounded-xl p-6 w-full md:w-1/2">

          <h2 className="font-semibold mb-4">
            Recent 5 Assessments
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <AreaChart data={lastFive}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="index" />

              <YAxis />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                fill="#c7d2fe"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* -------- Two Charts Side By Side -------- */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* Percentage Trend */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="font-semibold mb-4">
            Percentage Trend
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <LineChart data={assessments}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="index" />

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

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="font-semibold mb-4">
            Score Comparison
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart data={assessments}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="index" />

              <YAxis />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="score"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}