"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TrendingUp, CheckCircle } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Stats() {
  const [assessments, setAssessments] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sleepHours, setSleepHours] = useState("");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profile = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());

        const assess = await fetch(`/api/assessment?email=${profile.email}`).then((r) => r.json());
        const sleep = await fetch(`/api/sleep?email=${profile.email}`).then((r) => r.json());

        if (assess.success) setAssessments(assess.history);
        if (sleep.success) setSleepData(sleep.data);

        // FETCH TASKS (from planner)
        if (email) {
          const res = await fetch(`/api/tasks?email=${email}`);
          const data = await res.json();

          // sort latest first
          const sorted = data.sort((a, b) => b.id - a.id);
          setTasks(sorted.slice(0, 5)); // latest 5 tasks
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [email]);

  const latest = assessments[assessments.length - 1];

  const mentalChartData = assessments.map((item) => ({
    score: item.score,
    date: new Date(item.created_at).toLocaleDateString(),
  }));

  const sleepChartData = sleepData.map((item) => ({
    hours: item.hours,
    date: new Date(item.created_at).toLocaleDateString(),
  }));

  const saveSleep = async () => {
    if (!sleepHours) return;

    const token = localStorage.getItem("token");

    const profile = await fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    await fetch("/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        hours: Number(sleepHours),
      }),
    });

    setSleepHours("");

    const updated = await fetch(`/api/sleep?email=${profile.email}`).then((r) => r.json());
    if (updated.success) setSleepData(updated.data);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f7]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm">
            Track your mental wellness and sleep patterns daily.
          </p>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-xs text-gray-400">MENTAL HEALTH SCORE</p>
            <h2 className="text-4xl font-bold text-[#2f5d50] mt-2">
              {latest?.score || 0}
              <span className="text-base text-gray-400"> / 75</span>
            </h2>
            <p className="text-green-600 text-sm mt-3">
              +4% improved from last week
            </p>
          </div>

          <div className="bg-[#2f5d50] text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">Feeling Overwhelmed?</h3>
              <p className="text-sm opacity-80 mt-2">
                Take a 5-minute breathing exercise to reset your nervous system.
              </p>
            </div>
            <button className="mt-4 bg-white text-[#2f5d50] px-4 py-2 rounded-lg text-sm font-medium w-fit">
              Start Session
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <Calendar
              value={date}
              onChange={(val) => setDate(val)}
              className="!border-none !w-full text-sm"
              tileClassName="rounded-lg hover:bg-[#e6f0ed]"
            />
          </div>
        </div>

        {/* MIDDLE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-[#2f5d50]" />
                <h2 className="font-medium">Mental Health Trends</h2>
              </div>
              <div className="text-xs text-gray-400">Last 14 days</div>
            </div>

            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={mentalChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 75]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2f5d50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-gray-600 italic text-sm">
                Progress is not linear. Be as kind to yourself as you would be to a dear friend.
              </p>
              <p className="text-xs text-gray-400 mt-3">SANCTUARY CURATED</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-medium">Upcoming Session</h3>
              <p className="text-sm text-gray-500 mt-2">Dr. Sarah Chen</p>
              <p className="text-xs text-green-600 mt-1">Tomorrow at 10:00 AM</p>
              <button className="mt-4 w-full bg-gray-100 py-2 rounded-lg text-sm">
                View Details
              </button>
            </div>

          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SLEEP TRACKER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-medium mb-3">Sleep Tracker</h2>
            <p className="text-sm text-gray-400 mb-2">Last Night's Sleep (hrs)</p>
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full bg-gray-100 px-4 py-2 rounded-lg mb-3"
              placeholder="7.5"
            />
            <button
              onClick={saveSleep}
              className="w-full bg-[#2f5d50] text-white py-2 rounded-lg"
            >
              Save Progress
            </button>
          </div>

          {/* RECENT HISTORY (CONNECTED) */}
            <div className="bg-[#2f5d50] text-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-[#2f5d50]" size={20} />
              <h2 className="font-semibold">Recent Tasks</h2>
            </div>

            <div className="space-y-3">
              {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f4f3] transition-colors"
                >
                <CheckCircle
                  className={
                  task.completed
                    ? "text-[#2f5d50] flex-shrink-0"
                    : "text-gray-300 flex-shrink-0"
                  }
                  size={18}
                />
                <span
                  className={
                  task.completed
                    ? "line-through text-gray-400 text-sm"
                    : "text-gray-700 text-sm"
                  }
                >
                  {task.text}
                </span>
                </div>
              ))
              ) : (
              <p className="text-gray-400 text-sm text-center py-4">No recent tasks</p>
              )}
            </div>
            </div>

          {/* SLEEP CHART */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-medium mb-3">Sleep History</h2>
            <div className="h-32">
              <ResponsiveContainer>
                <BarChart data={sleepChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#2f5d50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}