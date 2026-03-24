"use client";

import { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TrendingUp, CheckCircle } from "lucide-react";
import { LineChart, Line } from "recharts";

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
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [sleepHours, setSleepHours] = useState("");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startSession = () => {
    // 5 minutes = 300 seconds
    setSecondsLeft(300);
    setIsSessionActive(true);

    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // stop when reaching 0
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsSessionActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const exitSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSessionActive(false);
    setSecondsLeft(0);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profile = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());

        const assess = await fetch(
          `/api/assessment?email=${profile.email}`
        ).then((r) => r.json());
        const sleep = await fetch(`/api/sleep?email=${profile.email}`).then(
          (r) => r.json()
        );
        // after fetching `assess`
if (assess.success && Array.isArray(assess.history)) {
  // sort by created_at ascending (oldest -> newest)
  const sorted = assess.history.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // keep only the most recent 10 entries
  const latestTen = sorted.slice(-10);

  setAssessments(latestTen);
}

        // if (assess.success) setAssessments(assess.history);
        if (sleep.success) setSleepData(sleep.data);

        // FETCH TASKS (from planner)
        if (email) {
          const res = await fetch(`/api/tasks?email=${email}`);
          const data = await res.json();

          // sort latest first (by id)
          const sorted = data.sort((a, b) => b.id - a.id);
          setTasks(sorted);

          // recentTasks: latest 3 tasks added
          setRecentTasks(sorted.slice(0, 3));

          // weeklyTasks: tasks with a date in the current week
          const now = new Date();
          // compute start of week (Monday)
          const day = now.getDay(); // 0 (Sun) - 6 (Sat)
          const diffToMonday = (day + 6) % 7; // days since Monday
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - diffToMonday);
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          const parseTaskDate = (t) => {
            const dateStr = t.due_date || t.date || t.created_at;
            if (!dateStr) return null;
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : d;
          };

          const weekly = sorted.filter((t) => {
            const d = parseTaskDate(t);
            if (!d) return false;
            return d >= startOfWeek && d <= endOfWeek;
          });

          setWeeklyTasks(weekly);
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
// compute last 7 days window (includes today)
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);
const startDate = new Date();
startDate.setDate(endDate.getDate() - 6);
startDate.setHours(0, 0, 0, 0);

// filter sleepData to last 7 days, parse dates, sort oldest -> newest
const sleepChartData = sleepData
  .map((item) => {
    const d = new Date(item.created_at || item.date || item.timestamp);
    return { ...item, _dateObj: d };
  })
  .filter((item) => {
    const d = item._dateObj;
    return d && d >= startDate && d <= endDate;
  })
  .sort((a, b) => a._dateObj - b._dateObj)
  .map((item) => ({
    hours: item.hours,
    date: item._dateObj.toLocaleDateString(),
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

    const updated = await fetch(`/api/sleep?email=${profile.email}`).then((r) =>
      r.json()
    );
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
    <div className="bg-[#f6f8f7] p-8">
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
          <div className="bg-white max-h-fit rounded-2xl p-6 shadow-sm">
            <p className="text-xs text-gray-400">ASSESSMENT SCORE</p>

            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#2f5d50] mt-2">
                {latest?.score || 0}
                <span className="text-base text-gray-400"> / 75</span>
              </h2>
              {/* <p className="text-green-600 text-sm mt-3">+4% improved from last week</p> */}
            </div>

            {/* Minimal line-only graph (no axes, no ticks, no grid, no tooltip) */}
            <div className="mt-4 w-full h-28 sm:h-36">
              {mentalChartData && mentalChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mentalChartData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                      activeDot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No data to display
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#2f5d50] text-white max-h-fit rounded-2xl p-6 flex flex-col justify-between relative">
            {/* Card content when session is not active */}
            {!isSessionActive && (
              <>
                <div>
                  <h3 className="text-lg font-semibold">Feeling Overwhelmed?</h3>
                  <p className="text-sm opacity-80 mt-2">
                    Take a 5-minute breathing exercise to reset your nervous system.
                  </p>
                </div>
                <button
                  onClick={startSession}
                  className="mt-4 bg-white text-[#2f5d50] px-4 py-2 rounded-lg text-sm font-medium w-fit"
                >
                  Start Session
                </button>
              </>
            )}

            {/* Overlay shown while session is active */}
            {isSessionActive && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
                <div className="w-full max-w-md mx-4 text-center text-white">
                  <h2 className="text-2xl font-semibold mb-4">Breathing Session</h2>

                  {/* Timer display */}
                  <div className="text-6xl font-bold tracking-wider mb-6">
                    {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                    {String(secondsLeft % 60).padStart(2, "0")}
                  </div>

                  {/* Simple breathing cue (optional) */}
                  <p className="text-sm opacity-80 mb-6">
                    Breathe in for 4 seconds, hold for 4, breathe out for 6. Repeat.
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={exitSession}
                      className="bg-white text-[#2f5d50] px-4 py-2 rounded-lg font-medium"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                <h2 className="font-medium">Depression test score</h2>
              </div>
              <div className="text-xs text-gray-400">Last 10 assessments</div>
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
              <h3 className="font-medium mb-4">Weekly Tasks</h3>
              <div className="space-y-2">
                {weeklyTasks.length > 0 ? (
                  weeklyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
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
                  <p className="text-gray-400 text-sm text-center py-4">No tasks for this week</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SLEEP TRACKER */}
          <div className="bg-pink-200 max-h-fit p-6 rounded-2xl shadow-sm">
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
          <div className="bg-[#2f5d50] text-white p-6 max-h-fit rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-[#2f5d50]" size={20} />
              <h2 className="font-semibold">Recent Tasks</h2>
            </div>

            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
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
          <div className="bg-white max-h-fit p-6 rounded-2xl shadow-sm">
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