"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Assessment = {
  score: number;
  severity: string;
  created_at: string;
};

export default function Stats() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = await profileRes.json();

        const res = await fetch(
          `/api/assessment?email=${profile.email}`
        );

        const data = await res.json();

        if (data.success) {
          setAssessments(data.history);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading stats...
      </div>
    );
  }

  const latest = assessments[assessments.length - 1];

  const chartData = assessments.map((item) => ({
    score: item.score,
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">

      {/* -------- Page Header -------- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Your Mental Health Stats
        </h1>
        <p className="text-gray-500 mt-1">
          Track your progress and monitor your mental wellbeing over time.
        </p>
      </div>

      {/* -------- Latest Result (Card Width Only) -------- */}
      {latest && (
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border text-center hover:shadow-xl transition">

            <h2 className="text-sm text-gray-500 mb-2">
              Latest Result
            </h2>

            <div className="text-5xl font-bold text-blue-600">
              {latest.score}
            </div>

            <p className="text-gray-500 mt-2">
              Severity:{" "}
              <span className="font-semibold text-gray-800">
                {latest.severity}
              </span>
            </p>

            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-600"
                style={{
                  width: `${(latest.score / 75) * 100}%`,
                }}
              />
            </div>

          </div>
        </div>
      )}

      {/* -------- Line Chart -------- */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" />
          <h2 className="font-semibold text-lg">
            Mental Health Trend
          </h2>
        </div>

        {chartData.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No data available
          </p>
        ) : (
          <div className="w-full h-[350px]">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 75]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
}