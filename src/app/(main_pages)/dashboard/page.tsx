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

type SleepEntry = {
  hours: number;
  created_at: string;
};

export default function Stats() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [sleepData, setSleepData] = useState<SleepEntry[]>([]);
  const [sleepHours, setSleepHours] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
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

        // Assessments
        const assessRes = await fetch(
          `/api/assessment?email=${profile.email}`
        );
        const assessData = await assessRes.json();

        if (assessData.success) {
          setAssessments(assessData.history);
        }

        // Sleep
        const sleepRes = await fetch(
          `/api/sleep?email=${profile.email}`
        );
        const sleepJson = await sleepRes.json();

        if (sleepJson.success) {
          setSleepData(sleepJson.data);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* ---------------- SAVE SLEEP ---------------- */
  const saveSleep = async () => {
    if (!sleepHours) return;

    const token = localStorage.getItem("token");

    const profileRes = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profile = await profileRes.json();

    await fetch("/api/sleep", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        hours: Number(sleepHours),
      }),
    });

    setSleepHours("");

    // Refresh sleep data
    const res = await fetch(`/api/sleep?email=${profile.email}`);
    const data = await res.json();

    if (data.success) {
      setSleepData(data.data);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading stats...
      </div>
    );
  }

  const latest = assessments[assessments.length - 1];

  /* ---------------- CHART DATA ---------------- */
  const mentalChartData = assessments.map((item) => ({
    score: item.score,
    date: new Date(item.created_at).toISOString(), // UNIQUE
  }));

  const sleepChartData = sleepData.map((item) => ({
    hours: item.hours,
    date: new Date(item.created_at).toISOString(), // UNIQUE
  }));

  return (
  <div className="max-w-6xl mx-auto space-y-10">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Your Health Stats
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Track your progress and monitor your wellbeing
      </p>
    </div>

    {/* Latest Result */}
    {latest && (
      <div>
        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-sm">

          <p className="text-xs text-gray-500 mb-2">
            Latest Assessment
          </p>

          <div className="text-4xl font-semibold text-[#2f5d50]">
            {latest.score}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Severity:{" "}
            <span className="font-medium text-gray-800">
              {latest.severity}
            </span>
          </p>

          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#2f5d50]"
              style={{
                width: `${(latest.score / 75) * 100}%`,
              }}
            />
          </div>

        </div>
      </div>
    )}

    {/* Sleep Tracker */}
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Sleep Tracker
          </h2>
          <p className="text-sm text-gray-500">
            Monitor your sleep patterns
          </p>
        </div>

        {sleepData.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Last Night</p>
            <p className="text-sm font-medium text-gray-900">
              {sleepData[sleepData.length - 1].hours} hrs
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="number"
          placeholder="e.g. 7.5"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2f5d50]"
        />

        <button
          onClick={saveSleep}
          className="bg-[#2f5d50] text-white px-5 rounded-xl hover:opacity-90"
        >
          Save
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sleepChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 12 }}
            />

            <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />

            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleString()
              }
            />

            <Line
              type="monotone"
              dataKey="hours"
              stroke="#2f5d50"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>

    {/* Mental Health Trend */}
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-[#2f5d50]" />
        <h2 className="text-lg font-medium text-gray-900">
          Assessment Trend
        </h2>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mentalChartData}>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 12 }}
            />

            <YAxis domain={[0, 75]} tick={{ fontSize: 12 }} />

            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleString()
              }
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2f5d50"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>

  </div>
);
}