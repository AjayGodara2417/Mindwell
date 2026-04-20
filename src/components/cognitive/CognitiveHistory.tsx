"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TestResult = {
  score: number;
  type: string;
  createdAt: string;
};

export default function CognitiveHistory({ userEmail }: { userEmail: string }) {
  const [data, setData] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/cognitive/history", {
          method: "POST",
          body: JSON.stringify({ email: userEmail }),
        });

        const json = await res.json();

        if (json.success) {
          setData(json.results);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  // transform for chart
  const chartData = data.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score,
  }));

  if (loading) {
    return (
      <div className="mt-10 text-center text-slate-500">
        Loading history...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="mt-10 text-center text-slate-400">
        No past test data found
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Cognitive Performance Trend
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}