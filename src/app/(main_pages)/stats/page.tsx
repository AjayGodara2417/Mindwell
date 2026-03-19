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
    <div className="max-w-6xl p-10 mx-auto space-y-12">

      {/* -------- HEADER -------- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Your Health Stats 😊
        </h1>
        <p className="text-gray-500 mt-1">
          Track your progress and monitor your wellbeing.
        </p>
      </div>

      {/* -------- LATEST RESULT -------- */}
      {latest && (
        <div className="flex">
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

      {/* -------- SLEEP TRACKER -------- */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sleep Tracker
            </h2>
            <p className="text-sm text-gray-500">
              Monitor your sleep patterns
            </p>
          </div>

          {sleepData.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Night</p>
              <p className="font-semibold text-gray-900">
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
            className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={saveSleep}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition"
          >
            Save
          </button>
        </div>

        {/* Chart */}
        <div className="w-full h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepChartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <YAxis domain={[0, 12]} />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />

              <Line
                type="monotone"
                dataKey="hours"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* -------- MENTAL HEALTH TREND -------- */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border">

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" />
          <h2 className="font-semibold text-lg">
            Assessment Result
          </h2>
        </div>

        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mentalChartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <YAxis domain={[0, 75]} />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />

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

      </div>

    </div>
  );
}